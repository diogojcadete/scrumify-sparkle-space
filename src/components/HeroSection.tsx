
import React, { useEffect, useRef } from 'react';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);
  
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -right-[30%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[40%] -left-[30%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div ref={heroRef} className="reveal-on-scroll space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary animate-fade-in">
              Revolutionize Your Scrum Process
            </div>
            
            <h1 className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Simplify Agile <br />
              <span className="text-primary">Project Management</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Transform the way your team works with our intuitive scrum board. 
              Visualize progress, optimize workflows, and deliver results faster.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <button className="btn-primary">
                Start Free Trial
              </button>
              <button className="inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-primary transition-colors h-11 px-6">
                Watch Demo
              </button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">10,000+</span> teams already using Scrumify
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur-3xl opacity-30"></div>
            <div className="glass-card rounded-xl p-2 relative animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="aspect-[4/3] w-full bg-white rounded-lg overflow-hidden shadow-xl">
                <div className="w-full h-8 bg-gray-100 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3 h-full">
                    <div className="flex flex-col space-y-2">
                      <div className="bg-gray-100 p-2 rounded">
                        <h4 className="text-sm font-semibold">To Do</h4>
                        <div className="mt-2 space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-2 rounded shadow-sm">
                              <div className="w-full h-2 bg-gray-200 rounded-full"></div>
                              <div className="w-3/4 h-2 mt-1 bg-gray-200 rounded-full"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="bg-gray-100 p-2 rounded">
                        <h4 className="text-sm font-semibold">In Progress</h4>
                        <div className="mt-2 space-y-2">
                          {[1, 2].map((i) => (
                            <div key={i} className="bg-white p-2 rounded shadow-sm">
                              <div className="w-full h-2 bg-gray-200 rounded-full"></div>
                              <div className="w-3/4 h-2 mt-1 bg-gray-200 rounded-full"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="bg-gray-100 p-2 rounded">
                        <h4 className="text-sm font-semibold">Done</h4>
                        <div className="mt-2 space-y-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white p-2 rounded shadow-sm">
                              <div className="w-full h-2 bg-gray-200 rounded-full"></div>
                              <div className="w-3/4 h-2 mt-1 bg-gray-200 rounded-full"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
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

export default HeroSection;
