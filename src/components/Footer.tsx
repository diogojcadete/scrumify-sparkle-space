
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold text-primary">Scrumify</Link>
            <p className="mt-4 text-gray-600">
              Simplify your agile workflow and boost productivity with our intuitive scrum management platform.
            </p>
            <div className="flex space-x-4 mt-6">
              <SocialIcon label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>
              </SocialIcon>
              <SocialIcon label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                </svg>
              </SocialIcon>
            </div>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <FooterLink href="#features">Features</FooterLink>
                <FooterLink href="#pricing">Pricing</FooterLink>
                <FooterLink href="#testimonials">Testimonials</FooterLink>
                <FooterLink href="#faq">FAQ</FooterLink>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/careers">Careers</FooterLink>
                <FooterLink href="/blog">Blog</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <FooterLink href="/help">Help Center</FooterLink>
                <FooterLink href="/guides">Guides</FooterLink>
                <FooterLink href="/api">API Documentation</FooterLink>
                <FooterLink href="/community">Community</FooterLink>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} Scrumify. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <FooterLink href="/privacy" className="text-sm">Privacy Policy</FooterLink>
            <FooterLink href="/terms" className="text-sm">Terms of Service</FooterLink>
            <FooterLink href="/cookies" className="text-sm">Cookie Policy</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <a 
    href="#" 
    aria-label={label}
    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
  >
    {children}
  </a>
);

const FooterLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
  <li>
    <a 
      href={href} 
      className={`text-gray-600 hover:text-primary transition-colors ${className}`}
    >
      {children}
    </a>
  </li>
);

export default Footer;
