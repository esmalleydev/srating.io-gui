import { useMemo, useRef, useEffect } from 'react';

const useDebounce = (callback: () => void, milliseconds: number) => {
  const ref = useRef<(() => void)>(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      // If a timer is already running, clear it so we can restart the clock
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timer
      timeoutRef.current = setTimeout(() => {
        if (ref.current) {
          ref.current();
        }
      }, milliseconds);
    };

    return func;
  }, [milliseconds]);

  // Cleanup: clear the timeout if the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

export default useDebounce;

/*
import { useRef, useEffect, useCallback } from 'react';

const useDebounce = <T extends (...args: unknown[]) => void>(
  callback: T,
  milliseconds: number,
) => {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);


  // Use useCallback with generic args
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, milliseconds);
    },
    [milliseconds],
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

export default useDebounce;

*/
