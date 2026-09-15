import React from 'react';
import { PublicNavbar } from '../components/PublicNavbar';
import { HeroSection } from '../components/HeroSection';
import { BrandsCarousel } from '../components/BrandsCarousel';
import { InteractiveServices } from '../components/InteractiveServices';
import { AboutSection } from '../components/AboutSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { ContactSection } from '../components/ContactSection';
import { PublicFooter } from '../components/PublicFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#0D7C84] selection:text-white">
      {/* Floating Glassmorphic Navbar */}
      <PublicNavbar />

      <main>
        {/* Hero — Dynamic cinematic slider */}
        <HeroSection />

        {/* Brands — Infinite marquee scroll */}
        <BrandsCarousel />

        {/* Services — Interactive accordion with morphing layout */}
        <InteractiveServices />

        {/* About / Nosotros — Timeline of advantages */}
        <AboutSection />

        {/* Testimonials — Cinematic split layout */}
        <TestimonialsSection />

        {/* Contact — Minimalist floating-label form */}
        <ContactSection />
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default LandingPage;
