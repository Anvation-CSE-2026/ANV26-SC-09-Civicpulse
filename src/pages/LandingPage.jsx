import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import ProblemSection from '../components/landing/ProblemSection';
import SolutionFlow from '../components/landing/SolutionFlow';
import AIEvidenceSection from '../components/landing/AIEvidenceSection';
import LiveIncidentSection from '../components/landing/LiveIncidentSection';
import LandingMap from '../components/landing/LandingMap';
import CitizenSection from '../components/landing/CitizenSection';
import MunicipalSection from '../components/landing/MunicipalSection';
import StatsSection from '../components/landing/StatsSection';
import CategoriesSection from '../components/landing/CategoriesSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F1E5] text-[#050505] font-sans antialiased selection:bg-[#B7FF2A]">
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <ProblemSection />
        <SolutionFlow />
        <AIEvidenceSection />
        <LiveIncidentSection />
        <LandingMap />
        <CategoriesSection />
        <CitizenSection />
        <MunicipalSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
