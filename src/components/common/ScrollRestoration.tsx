
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollPositions {
  [key: string]: number;
}

const ScrollRestoration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [scrollPositions, setScrollPositions] = useState<ScrollPositions>({});
  const [initialLoad, setInitialLoad] = useState(true);

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
    
    // Don't scroll on initial page load
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    
    // Use requestAnimationFrame to ensure DOM has updated before scrolling
    const timeoutId = setTimeout(() => {
      if (savedPosition !== undefined) {
        window.scrollTo(0, savedPosition);
      } else {
        // Only scroll to top for new paths we haven't visited
        // and only when it's not an initial load
        if (!Object.keys(scrollPositions).includes(currentPath)) {
          // We don't automatically scroll to top for new pages anymore
          // window.scrollTo(0, 0);
        }
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.search, scrollPositions, initialLoad]);

  return <>{children}</>;
};

export default ScrollRestoration;
