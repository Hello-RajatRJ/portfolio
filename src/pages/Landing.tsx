import React, { useState } from 'react';
import { useLenisScroll } from '../hooks/useLenisScroll';
import { DeadpoolPreloader } from '../components/ui/DeadpoolPreloader';
import { DeadpoolCursor } from '../components/ui/DeadpoolCursor';
import { ClickSparkDecal } from '../components/ui/ClickSparkDecal';
import { ScrollProgressBar } from '../components/ui/ScrollProgressBar';
import { DeadpoolEasterEggs } from '../components/ui/DeadpoolEasterEggs';
import { Navbar } from './landing/Navbar';
import { Hero } from './landing/Hero';
import { About } from './landing/About';
import { Skills } from './landing/Skills';
import { Experience } from './landing/Experience';
import { Projects } from './landing/Projects';
import { LiveBackendDemo } from '../components/backend-demo/LiveBackendDemo';
import { CredibilityAndEngineering } from '../components/credibility/CredibilityAndEngineering';
import { RacingWorldTeaser } from '../components/racing-teaser/RacingWorldTeaser';
import { ResumeSection } from './landing/ResumeSection';
import { Contact } from './landing/Contact';
import { Footer } from './landing/Footer';

export const Landing: React.FC = () => {
  // Activate Lenis Smooth Momentum Scrolling + GSAP ScrollTrigger Sync
  useLenisScroll(true);

  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#000000] text-white overflow-x-clip selection:bg-[#E62429] selection:text-white">
      {/* 0. Preloader with SVG "RJ" stroke draw and katana slash exit */}
      {!preloaderDone && <DeadpoolPreloader onComplete={() => setPreloaderDone(true)} />}

      {/* Global Interactive Layers */}
      <DeadpoolCursor />
      <ClickSparkDecal />
      <ScrollProgressBar />
      <DeadpoolEasterEggs />

      {/* Subtle Atmospheric Overlays: Film Grain & Crimson Vignette */}
      <div className="dp-film-grain" aria-hidden="true" />
      <div className="dp-vignette" aria-hidden="true" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Flow */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <LiveBackendDemo />
        <CredibilityAndEngineering />
        <RacingWorldTeaser />
        <ResumeSection />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};
