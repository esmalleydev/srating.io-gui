import React, { useEffect, useMemo, useState } from 'react';

// https://stackoverflow.com/questions/45514676/react-check-if-element-is-visible-in-dom

export default function useOnScreen<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [isIntersecting, setIntersecting] = useState(false);

  /*
  const observer = useMemo(() => new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting),
  ), [ref]);


  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);
  */

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref]);

  return isIntersecting;
}
