'use client';

import { useEffect } from 'react';

export default function Conversions() {
  useEffect(() => {
    // @ts-expect-error gtag is added on root
    if (window.gtag && typeof window.gtag === 'function') {
      // @ts-expect-error gtag is added on root
      window.gtag('event', 'conversion', {
        'send_to': 'AW-11331182972/mmDvCKu5sIMaEPzCkJsq'
      });
    }
    
    // @ts-expect-error twq is added on root
    if (window.twq && typeof window.twq === 'function') {
      // @ts-expect-error twq is added on root
      window.twq('event', 'tw-qltj2-qltj3', {
        conversion_id: 'twitter' 
      });
    }
  }, []);

  return null;
}
