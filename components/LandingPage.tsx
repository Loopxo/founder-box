'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from './landing/HeroSection';

const AboutSection = dynamic(() => import('./landing/AboutSection'), {
  loading: () => <div className="h-96 bg-[#111118]" />,
  ssr: true
});

const ProjectsSection = dynamic(() => import('./landing/ProjectsSection'), {
  loading: () => <div className="h-96 bg-[#111118]" />,
  ssr: true
});

const WhyChooseUsSection = dynamic(() => import('./landing/WhyChooseUsSection'), {
  loading: () => <div className="h-96 bg-[#111118]" />,
  ssr: true
});

const ContactSection = dynamic(() => import('./landing/ContactSection'), {
  loading: () => <div className="h-96 bg-[#111118]" />,
  ssr: true
});

export default function LandingPage() {
  return (
    <div className="relative w-full bg-[#111118]">
      {/* Sticky container for Hero Section */}
      <div className="sticky top-0 h-screen w-full z-0">
        <HeroSection />
      </div>

      {/* Main Content - slides over the sticky hero */}
      <div className="relative z-10 bg-[#111118] w-full shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        <Suspense fallback={<div className="h-96 bg-[#111118]" />}>
          <AboutSection />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-[#111118]" />}>
          <ProjectsSection />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-[#111118]" />}>
          <WhyChooseUsSection />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-[#111118]" />}>
          <ContactSection />
        </Suspense>
      </div>
    </div>
  );
}
