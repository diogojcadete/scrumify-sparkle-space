
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out py-4 px-6",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-bold text-primary flex items-center space-x-2 transition-all duration-300 hover:opacity-80"
        >
          <span className="text-2xl">Scrumify</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how-it-works">How it Works</NavLink>
          <NavLink href="#testimonials">Testimonials</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button className="hidden md:block text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            Log in
          </button>
          <button className="btn-primary">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href} 
    className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
  >
    {children}
  </a>
);

export default Navbar;
