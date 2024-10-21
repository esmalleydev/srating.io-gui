import { useMemo, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';

const useDebounce = (callback: () => void, milliseconds: number) => {
  const ref = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      if (ref.current) {
        ref.current();
      }
    };

    return debounce(func, milliseconds);
  }, []);

  return debouncedCallback;
};

export default useDebounce;

