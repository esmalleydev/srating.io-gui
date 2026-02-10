'use client';

import { useEffect } from 'react';

export default function Conversions() {
  useEffect(() => {
    // @ts-expect-error gtag is added on root
    if (window.gtag && typeof window.gtag === 'function') {
      // @ts-expect-error gtag is added on root
      window.gtag('event', 'conversion', {
        send_to: 'AW-11331182972/mmDvCKu5sIMaEPzCkJsq',
      });
    }

    // @ts-expect-error twq is added on root
    if (window.twq && typeof window.twq === 'function') {
      // @ts-expect-error twq is added on root
      window.twq('event', 'tw-qltj2-qltj6', {
        conversion_id: crypto.randomUUID(), // not sure what I should put here, the stripe price_id ??
        value: null, // use this to pass the value of the conversion (e.g. 5.00)
      });
    }
  }, []);

  return null;
}
