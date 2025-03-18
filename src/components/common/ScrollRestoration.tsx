
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollPositions {
  [key: string]: number;
}

const ScrollRestoration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [scrollPositions, setScrollPositions] = useState<ScrollPositions>({});
  const [initialLoad, setInitialLoad] = useState(true);
  const isManualScrollRef = useRef(false);
  const pathRef = useRef(location.pathname + location.search);

  // Save scroll position before navigating away
  useEffect(() => {
    const handleScroll = () => {
      if (isManualScrollRef.current) return;
      
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

  // Track path changes
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    // If path changed, mark it for restoration
    if (pathRef.current !== currentPath) {
      pathRef.current = currentPath;
    }
    
  }, [location.pathname, location.search]);

  // Restore scroll position when route changes
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const savedPosition = scrollPositions[currentPath];
    
    // Don't do anything on initial page load
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    
    // Use requestAnimationFrame to ensure DOM has updated before scrolling
    const timeoutId = setTimeout(() => {
      if (savedPosition !== undefined) {
        isManualScrollRef.current = true;
        window.scrollTo(0, savedPosition);
        
        // Reset manual scroll flag after a short delay
        setTimeout(() => {
          isManualScrollRef.current = false;
        }, 100);
      }
      // We've completely disabled automatic scroll to top for new pages
    }, 50); // Slight delay to ensure DOM is ready
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.search, scrollPositions, initialLoad]);

  return <>{children}</>;
};

export default ScrollRestoration;
