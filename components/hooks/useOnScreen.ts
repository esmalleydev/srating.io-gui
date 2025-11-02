'use client';

import React, { useEffect, useState } from 'react';

// https://stackoverflow.com/questions/45514676/react-check-if-element-is-visible-in-dom

export default function useOnScreen<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  scrollRef: React.RefObject<T | null>,
  rootMargin = '0px',
  threshold = 0.01,
) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (
      !node ||
      !node.isConnected
    ) {
      setIntersecting(false);
      return; // elemnt not mounted yet
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin, threshold }, // trigger if even 1% of element is visible
    );

    observer.observe(node);

    // eslint-disable-next-line consistent-return
    return () => {
      if (node.isConnected) {
        observer.unobserve(node);
      }
    };
  }, [ref.current, scrollRef.current?.scrollTop, rootMargin, threshold]);

  return isIntersecting;
}
