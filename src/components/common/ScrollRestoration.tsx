
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollPositions {
  [key: string]: number;
}

const ScrollRestoration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [scrollPositions, setScrollPositions] = useState<ScrollPositions>({});

  // Save scroll position before navigating away
  useEffect(() => {
    const handleScroll = () => {
      const currentPath = location.pathname + location.search;
      setScrollPositions((prev) => ({
        ...prev,
        [currentPath]: window.scrollY,
      }));
    };

    // Save scroll position on scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  // Restore scroll position when route changes
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const savedPosition = scrollPositions[currentPath];
    
    // Use requestAnimationFrame to ensure DOM has updated before scrolling
    const timeoutId = setTimeout(() => {
      if (savedPosition !== undefined) {
        window.scrollTo(0, savedPosition);
      } else {
        // Only scroll to top for new paths we haven't visited
        // This prevents scrolling to top when going back in history
        if (!Object.keys(scrollPositions).includes(currentPath)) {
          window.scrollTo(0, 0);
        }
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.search, scrollPositions]);

  return <>{children}</>;
};

export default ScrollRestoration;
