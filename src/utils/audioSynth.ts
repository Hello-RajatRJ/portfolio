class AudioSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private currentBeat = 0;
  private tempo = 110; // BPM
  private synthDelayNode: DelayNode | null = null;

  // Notes frequencies (Hz) for A Minor / C Major retro theme
  // A1=55, C2=65.4, G1=49, F1=43.7
  private bassNotes = [
    55.00, 55.00, 110.00, 55.00,  // A1 / A2
    65.41, 65.41, 130.81, 65.41,  // C2 / C3
    49.00, 49.00, 98.00,  49.00,  // G1 / G2
    43.65, 43.65, 87.31,  43.65   // F1 / F2
  ];

  // Lead arpeggio notes (frequencies in Hz)
  private leadNotes = [
    220.00, 261.63, 329.63, 392.00, // A3, C4, E4, G4
    261.63, 329.63, 392.00, 523.25, // C4, E4, G4, C5
    196.00, 246.94, 293.66, 392.00, // G3, B3, D4, G4
    174.61, 220.00, 261.63, 349.23  // F3, A3, C4, F4
  ];

  public start() {
    if (this.isPlaying) return;

    // Initialize AudioContext
    if (!this.ctx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.currentBeat = 0;

    // Create a global delay effect for spacey synth vibes
    this.synthDelayNode = this.ctx.createDelay(1.0);
    const feedbackNode = this.ctx.createGain();
    const delayFilter = this.ctx.createBiquadFilter();

    this.synthDelayNode.delayTime.value = 0.35; // delay time
    feedbackNode.gain.value = 0.35; // feedback level
    delayFilter.frequency.value = 1200; // filter out high harsh sounds in feedback

    // Connect feedback loop: delay -> filter -> gain -> delay
    this.synthDelayNode.connect(delayFilter);
    delayFilter.connect(feedbackNode);
    feedbackNode.connect(this.synthDelayNode);

    // Connect delay node to output
    this.synthDelayNode.connect(this.ctx.destination);

    // Start scheduling loop
    const lookahead = 100.0; // Milliseconds
    const scheduleAheadTime = 0.15; // Seconds
    let nextNoteTime = this.ctx.currentTime;

    const scheduler = () => {
      if (!this.isPlaying || !this.ctx) return;

      while (nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
        this.scheduleNote(this.currentBeat, nextNoteTime);
        const secondsPerBeat = 60.0 / this.tempo / 2; // Eighth notes
        nextNoteTime += secondsPerBeat;
        this.currentBeat = (this.currentBeat + 1) % 32;
      }
      this.timerId = setTimeout(scheduler, lookahead);
    };

    scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleNote(beat: number, time: number) {
    if (!this.ctx) return;

    // --- BASS SYNTH ---
    // Play bass on every eighth note
    const bassFreq = this.bassNotes[Math.floor(beat / 2) % this.bassNotes.length];
    
    // Create nodes
    const oscBass = this.ctx.createOscillator();
    const gainBass = this.ctx.createGain();
    const filterBass = this.ctx.createBiquadFilter();

    oscBass.type = 'sawtooth';
    oscBass.frequency.value = bassFreq;

    // Cyberpunk sweeping filter envelope
    filterBass.type = 'lowpass';
    filterBass.frequency.setValueAtTime(150, time);
    filterBass.frequency.exponentialRampToValueAtTime(700, time + 0.05);
    filterBass.frequency.exponentialRampToValueAtTime(120, time + 0.2);

    // Volume envelope
    gainBass.gain.setValueAtTime(0.18, time);
    gainBass.gain.exponentialRampToValueAtTime(0.01, time + 0.22);

    // Connections
    oscBass.connect(filterBass);
    filterBass.connect(gainBass);
    gainBass.connect(this.ctx.destination);

    oscBass.start(time);
    oscBass.stop(time + 0.25);

    // --- ARPEGGIATOR / LEAD ---
    // Play lead on every beat if beat is even, or let it follow a sci-fi arpeggio pattern
    const shouldPlayLead = (beat % 2 === 0) && (Math.floor(beat / 4) % 2 === 1 || beat % 8 === 0);
    if (shouldPlayLead) {
      const leadFreq = this.leadNotes[beat % this.leadNotes.length];

      const oscLead = this.ctx.createOscillator();
      const gainLead = this.ctx.createGain();
      const filterLead = this.ctx.createBiquadFilter();

      // Cyber retro triangle sound for a softer lead
      oscLead.type = 'triangle';
      oscLead.frequency.value = leadFreq;

      filterLead.type = 'bandpass';
      filterLead.frequency.setValueAtTime(800, time);
      filterLead.frequency.linearRampToValueAtTime(1500, time + 0.1);

      gainLead.gain.setValueAtTime(0.07, time);
      gainLead.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      // Connect to destination AND the space delay node
      oscLead.connect(filterLead);
      filterLead.connect(gainLead);
      gainLead.connect(this.ctx.destination);
      if (this.synthDelayNode) {
        gainLead.connect(this.synthDelayNode);
      }

      oscLead.start(time);
      oscLead.stop(time + 0.4);
    }

    // --- CYBER HI-HAT (Subtle Percussion) ---
    // Simple noise generator for high-hats on off-beats
    if (beat % 4 === 2) {
      const bufferSize = this.ctx.sampleRate * 0.04; // 40ms of noise
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 7000;

      const gainNoise = this.ctx.createGain();
      gainNoise.gain.setValueAtTime(0.015, time);
      gainNoise.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

      noiseNode.connect(noiseFilter);
      noiseFilter.connect(gainNoise);
      gainNoise.connect(this.ctx.destination);

      noiseNode.start(time);
      noiseNode.stop(time + 0.05);
    }
  }
}

export const audioSynth = new AudioSynth();
