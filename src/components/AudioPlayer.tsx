import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: (playing: boolean) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, onToggle }) => {
  const handleToggle = () => {
    if (isPlaying) {
      audioSynth.stop();
      onToggle(false);
    } else {
      audioSynth.start();
      onToggle(true);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      className={`audio-toggle-btn ${isPlaying ? 'playing' : ''}`}
      aria-label={isPlaying ? 'Mute Music' : 'Play Music'}
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 100,
        background: 'rgba(10, 10, 20, 0.6)',
        backdropFilter: 'blur(8px)',
        border: isPlaying ? '1px solid #00f0ff' : '1px solid rgba(255, 0, 127, 0.4)',
        boxShadow: isPlaying ? '0 0 10px rgba(0, 240, 255, 0.4)' : 'none',
        borderRadius: '50%',
        width: '46px',
        height: '46px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: isPlaying ? '#00f0ff' : '#ff007f',
        transition: 'all 0.3s ease',
      }}
    >
      {isPlaying ? (
        <Volume2 size={20} className="pulse-icon" />
      ) : (
        <VolumeX size={20} />
      )}
    </button>
  );
};
