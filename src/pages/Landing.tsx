import React from 'react';
import { Navbar } from './landing/Navbar';
import { Hero } from './landing/Hero';
import { About } from './landing/About';
import { Skills } from './landing/Skills';
import { Experience } from './landing/Experience';
import { Projects } from './landing/Projects';
import { ResumeSection } from './landing/ResumeSection';
import { Contact } from './landing/Contact';
import { Footer } from './landing/Footer';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-slate-800 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <ResumeSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};
