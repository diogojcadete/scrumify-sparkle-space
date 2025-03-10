
import React, { useEffect, useRef } from 'react';

const CallToAction = () => {
  const ctaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      },
      { threshold: 0.1 }
    );
    
    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }
    
    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);
  
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-blue-500/5"></div>
      </div>
      
      <div className="section-container">
        <div ref={ctaRef} className="reveal-on-scroll max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                Start Today
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Elevate Your <span className="text-primary">Scrum Process</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Join thousands of teams who have transformed their agile workflow with Scrumify. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button className="btn-primary">
                  Get Started Free
                </button>
                <button className="inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-primary transition-colors h-11 px-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                  Schedule Demo
                </button>
              </div>
            </div>
            <div className="hidden md:block relative bg-primary/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-white rounded-xl shadow-lg p-6 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                    <div className="col-span-3 mb-2">
                      <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-100 rounded-lg shadow-sm flex items-center justify-center text-xs font-medium animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
