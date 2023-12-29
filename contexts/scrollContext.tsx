import React, { createContext, useContext, ReactNode, RefObject, useRef, useEffect, useState } from 'react';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';
import { usePathname, useSearchParams } from 'next/navigation';

type ScrollContextType = RefObject<HTMLDivElement> | null;

// Create the context
const ScrollContext = createContext<ScrollContextType>(null);

// Create a provider component
interface ScrollProviderProps {
  children: ReactNode;
};

interface ScrollContainerProps {
  children: ReactNode;
};

const ScrollProvider: React.FC<ScrollProviderProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <ScrollContext.Provider value={scrollRef}>
      {children}
    </ScrollContext.Provider>
  );
};

// Create a custom hook for using the context
const useScrollContext = (): RefObject<HTMLDivElement> => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }
  return context;
};

const ScrollContainer: React.FC<ScrollContainerProps> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { width } = useWindowDimensions() as Dimensions;

  const [currentPathname] = useState(pathname);


  const scrollRefContext = useScrollContext();

  let scrollerClasses = 'overlay_scroller';

  if (width < 750) {
    scrollerClasses += ' hide_scroll';
  }

  // resets scroll position between pages
  // todo if a page has custom scrolling, this will reset it
  // TODO THIS SHOULD SHOULD NOT BE NEEDED ANYMORE GO UPDATE THE GAMES ROUTER CHANGE TO NOT SCROLL
  // https://nextjs.org/docs/app/api-reference/functions/use-router#disabling-scroll-restoration
  // useEffect(() => {
  //   router.events.on('routeChangeComplete', () => {
  //     if (scrollRef.current) {
  //       scrollRef.current.scrollTop = 0
  //     }
  //   })
  // }, [router.events])

  useEffect(() => {
    if (
      currentPathname !== pathname &&
      scrollRefContext &&
      scrollRefContext.current
    ) {
      scrollRefContext.current.scrollTop = 0;
    }
  }, [pathname, searchParams]);

  return (
    <div ref = {scrollRefContext} className = {scrollerClasses}>
      {children}
    </div>
  );
};

export { ScrollProvider, useScrollContext, ScrollContainer };