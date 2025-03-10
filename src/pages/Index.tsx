
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    // Setup intersection observer for reveal animations
    const setupRevealAnimations = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.1 }
      );
      
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        observer.observe(el);
      });
      
      return () => {
        document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
          observer.unobserve(el);
        });
      };
    };
    
    setupRevealAnimations();
    
    // Update document title
    document.title = "Scrumify - Simplify Agile Project Management";
    
  }, []);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
