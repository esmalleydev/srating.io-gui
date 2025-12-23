'use client';

import Style from '@/components/utils/Style';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';


const Plane = (
  {
    open,
    onClose,
    anchor,
    children,
  }:
  {
    open: boolean;
    onClose: (e: MouseEvent) => void;
    anchor: HTMLElement | null;
    children: React.ReactNode;
  },
) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  const transformScale = 0.8;

  const [styleState, setStyleState] = useState({
    top: 0,
    left: 0,
    transformOrigin: 'top left', // Default origin
    opacity: 0, // Start invisible to prevent flickering
  });

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    }
    //  else {
    //   setIsVisible(false);
    // }
    // Note: We DO NOT set isVisible(false) here.
    // We wait for onAnimationEnd to do that.
  }, [open]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose(e);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsVisible(false);
        onClose(event);
      }
    };

    if (open) {
      window.addEventListener('keydown', handleEsc);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);


  useLayoutEffect(() => {
    if (open && contentRef.current && anchor) {
      const popoverRect = contentRef.current.getBoundingClientRect();

      const anchorRect = anchor.getBoundingClientRect();

      const popoverWidth = popoverRect.width;
      const popoverHeight = popoverRect.height;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 10;

      // todo this is causing issues... sometimes it needs the division, other times it does not??
      // if the left is off then look here
      if (open) {
        // This assumes the measurement is taken while it's scaled at 0.8
        // If the element is currently scaled down, calculate its true size:
        // popoverWidth /= transformScale;
        // popoverHeight /= transformScale;
      }

      // --- Defaults: Place BELOW the button, aligned to LEFT ---
      let newTop = anchorRect.bottom;
      let newLeft = anchorRect.left;
      let originY = 'top';
      let originX = 'left';

      // --- Vertical Check (Y Axis) - Check this first ---
      // If popover goes off the bottom edge, place it ABOVE the button
      if (newTop + popoverHeight > viewportHeight - padding) {
        newTop = anchorRect.top - popoverHeight;
        originY = 'bottom';

        // If STILL off screen (above viewport), clamp it
        if (newTop < padding) {
          newTop = padding;
          originY = 'top';
        }
      }

      // --- Horizontal Check (X Axis) ---
      // If popover goes off the right edge, align to right of button
      if (newLeft + popoverWidth > viewportWidth - padding) {
        newLeft = anchorRect.right - popoverWidth;
        originX = 'right';
      }

      // If it's NOW off the left edge, clamp to left with padding
      if (newLeft < padding) {
        newLeft = padding;
        originX = 'left';
      }

      setStyleState({
        top: newTop,
        left: newLeft,
        transformOrigin: `${originY} ${originX}`,
        opacity: 1,
      });
    }
  }, [open, anchor, isVisible]);

  const handleAnimationEnd = () => {
    if (!open) {
      setIsVisible(false); // Remove from DOM now
    }
  };


  if (!isVisible) {
    return null;
  }

  const zIndex = Style.getZIndex().modal;

  const animationString = open
    ? 'pop-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
    : 'pop-out 0.2s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards';

  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex,
    backgroundColor: 'transparent',
    transition: 'opacity 0.2s',
    // opacity: open ? 1 : 0,
    // pointerEvents: open ? 'auto' : 'none', // Prevent clicks while fading out
  };

  const containerStyle = {
    position: 'fixed',
    // zIndex: zIndex + 1,
    boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
    padding: 0,
    top: styleState.top,
    left: styleState.left,
    transformOrigin: styleState.transformOrigin,
    opacity: open ? styleState.opacity : 1,
    /* The "Pop" Animation */
    animation: animationString,

    // Define both keyframes here
    '@keyframes pop-in': {
      '0%': { transform: `scale(${transformScale})`, opacity: 0 },
      '100%': { transform: 'scale(1)', opacity: 1 },
    },
    '@keyframes pop-out': {
      '0%': { transform: 'scale(1)', opacity: 1 },
      '100%': { transform: `scale(${transformScale})`, opacity: 0 },
    },
    // animation: 'pop-scale 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
    // '@keyframes pop-scale': {
    //   '0%': {
    //     transform: 'scale(0.8)',
    //   },
    //   '100%': {
    //     transform: 'scale(1)',
    //   },
    // },
  };

  const handleClick = (e) => {
    // todo is this needed anymore?
    onClose(e);
  };


  // We render this into the document.body using a Portal
  return ReactDOM.createPortal(
    <div className = {Style.getStyleClassName(backdropStyle)} onClick={handleClick}>
      <div
        className = {Style.getStyleClassName(containerStyle)}
        onClick = {(e) => {
          e.stopPropagation();
          e.nativeEvent.stopPropagation();
        }}
        onAnimationEnd={handleAnimationEnd}
        ref={contentRef}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Plane;
