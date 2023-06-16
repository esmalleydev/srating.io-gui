import React, { useMemo, useRef, useEffect } from 'react';
import debounce from "lodash/debounce";

const useDebounce = (callback, milliseconds) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current && ref.current();
    };

    return debounce(func, milliseconds);
  }, []);

  return debouncedCallback;
};

export default useDebounce;

