
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
  const restorationDoneRef = useRef(false);

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

    // Use passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  // Reset restoration flag when route changes
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    if (pathRef.current !== currentPath) {
      pathRef.current = currentPath;
      restorationDoneRef.current = false;
    }
  }, [location.pathname, location.search]);

  // Restore scroll position when route changes
  useEffect(() => {
    // Don't do anything on initial page load
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    
    const currentPath = location.pathname + location.search;
    const savedPosition = scrollPositions[currentPath];
    
    // Skip restoration if already done for this path or if scrolling to an anchor 
    if (restorationDoneRef.current || location.hash) {
      return;
    }
    
    if (savedPosition !== undefined) {
      // Delay scroll restoration to ensure DOM is fully updated
      const timeoutId = setTimeout(() => {
        isManualScrollRef.current = true;
        window.scrollTo({
          top: savedPosition,
          behavior: 'auto' // Use instant scroll for restoration
        });
        
        // Mark this restoration as done
        restorationDoneRef.current = true;
        
        // Reset manual scroll flag after a short delay
        setTimeout(() => {
          isManualScrollRef.current = false;
        }, 100);
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
    
    // We don't auto-scroll to top for new pages
  }, [location.pathname, location.search, location.hash, scrollPositions, initialLoad]);

  return <>{children}</>;
};

export default ScrollRestoration;
