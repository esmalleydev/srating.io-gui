import { useEffect, useState } from 'react';


const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check for "ontouchstart" in window or maxTouchPoints in navigator
    if (typeof window !== 'undefined') {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouch(hasTouch);
    }
  }, []);

  return isTouch;
};

export default useIsTouchDevice;
