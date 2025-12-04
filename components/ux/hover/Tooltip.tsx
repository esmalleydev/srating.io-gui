'use client';

import React, { useRef, useState, useEffect, Profiler, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import Paper from '@/components/ux/container/Paper';
// import useIsTouchDevice from '@/components/hooks/useIsTouchDevice';

// todo on hover might need an if width < 500 to disable if hover amount is longer than x seconds, gets buggy while scrolling

// tip, if the tooltip is not showing up, the react tsx file is probably not appending the ...props stuff

const Tooltip = <T extends HTMLElement>(
  {
    text,
    position = 'bottom',
    delay = 100,
    onClickFade = 3000,
    // onTouchFade = 2000,
    disableOnFocus = false,
    onClickRemove = false,
    style = {},
    children,
  }:
  {
    text: string;
    position?: string;
    delay?: number;
    onClickFade?: number;
    // onTouchFade?: number;
    disableOnFocus?: boolean;
    onClickRemove?: boolean;
    style?: React.CSSProperties;
    children: React.ReactElement<{
      ref?: React.Ref<T>;
      onClick?: () => void;
      onPointerEnter?: () => void;
      onPointerLeave?: () => void;
      onPointerDown?: () => void;
      onFocus?: () => void;
      onBlur?: () => void;
    }>;
  },
) => {
  // const isTouchDevice = useIsTouchDevice();
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef<T>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // Stable refs for timers so they can be cleared reliably across renders
  const showTimeoutRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);

  const baseStyles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 9999,
    padding: '6px 12px',
    fontSize: '14px',
    transition: 'opacity 300ms ease-in-out',
    // minWidth: 'max-content',
    maxWidth: 300,
    textAlign: 'center',
    pointerEvents: 'none',
    opacity: isVisible ? 1 : 0,
    top: coords.top,
    left: coords.left,
    ...style,
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) {
        // Hide the tooltip on any scroll event
        handleHide();
      }
    };

    // 2. Add the scroll event listener to the window when the component mounts
    // and when the visibility state changes (to potentially re-enable)
    window.addEventListener('scroll', handleScroll, true); // Use 'true' for capture phase if needed for better immediate detection

    // 3. Cleanup function to remove the listener when the component unmounts
    // or before the effect runs again (which is necessary for proper cleanup)
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isVisible]);

  useLayoutEffect(() => {
    if (isVisible && containerRef.current && tooltipRef.current) {
      const targetRect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newTop = 0;
      let newLeft = 0;

      switch (position) {
        case 'bottom':
          newTop = targetRect.bottom + 8;
          newLeft = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          newTop = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          newLeft = targetRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          newTop = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          newLeft = targetRect.right + 8;
          break;
        case 'top':
        default:
          newTop = targetRect.top - tooltipRect.height;
          newLeft = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          break;
      }

      // Adjust position to stay within the viewport
      if (newTop < 0) {
        newTop = 8;
      }
      if (newTop + tooltipRect.height > viewportHeight) {
        newTop = viewportHeight - tooltipRect.height - 8;
      }
      if (newLeft < 0) {
        newLeft = 8;
      }
      if (newLeft + tooltipRect.width > viewportWidth) {
        newLeft = viewportWidth - tooltipRect.width - 8;
      }

      setCoords({ top: newTop + window.scrollY, left: newLeft + window.scrollX });
    }
  }, [isVisible, position, text]);


  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
    };
  }, []);

  const log = (...args) => {
    console.log(...args);
  };

  const handleShow = (overrideDelay: number | null = null) => {
    log('handleShow');
    // clear any prior show timer and schedule a new one
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    const d = overrideDelay !== null ? overrideDelay : delay;

    if (d === 0) {
      log('handleShow now!');
      setIsVisible(true);
      showTimeoutRef.current = null;
    } else {
      showTimeoutRef.current = window.setTimeout(() => {
        log('handleShow timeout');
        setIsVisible(true);
        showTimeoutRef.current = null;
      }, d);
    }
  };

  const handleHide = () => {
    log('handleHide');
    // clear both timers and hide
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    setIsVisible(false);
  };

  const handleFocus = () => {
    log('handleFocus');
    if (disableOnFocus) {
      log('disableOnFocus');
      return;
    }

    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }

    handleShow();
  };

  const handlePointerEnter = () => {
    log('handlePointerEnter');
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    handleShow();
  };

  /*
  const handlePointerDown = () => {
    log('handlePointerDown');

    if (onClickRemove) {
      log('onClickRemove');
      handleHide();
    }

    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    handleShow();

    if (onTouchFade) {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }

      // Schedule hide after onClickFade ms
      fadeTimeoutRef.current = window.setTimeout(() => {
        handleHide();
        fadeTimeoutRef.current = null;
      }, onTouchFade);
    }
  };
  */

  const handlePointerLeave = () => {
    log('handlePointerLeave');
    // If a show timer is still pending, cancel it; otherwise hide immediately
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    handleHide();
  };

  const handleClick = () => {
    log('handleClick');
    if (onClickRemove) {
      log('onClickRemove');
      handleHide();
      return;
    }

    handleShow(0);

    if (onClickFade) {
      log('onClickFade');

      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }

      // Schedule hide after onClickFade ms
      fadeTimeoutRef.current = window.setTimeout(() => {
        log('onClickFade timeout');
        handleHide();
        fadeTimeoutRef.current = null;
      }, onClickFade);
    }
  };

  // Use cloneElement to add props to the child without wrapping it
  const childWithProps = React.cloneElement(children, {
    ref: containerRef,
    onClick: (...args) => {
      log('onClick');
      handleClick(...args);
      // Call the child's original event handler if it exists
      if (children.props.onClick) {
        log('onClick child');
        children.props.onClick(...args);
      }
    },
    onPointerEnter: (...args) => {
      log('onPointerEnter');
      handlePointerEnter(...args);
      if (children.props.onPointerEnter) {
        log('onPointerEnter child');
        children.props.onPointerEnter(...args);
      }
    },
    // onPointerDown: (...args) => {
    //   log('onPointerDown');
    //   if (isTouchDevice) {
    //     log('onPointerDown isTouchDevice');
    //     handlePointerDown(...args);
    //   }
    //   if (children.props.onPointerDown) {
    //     log('onPointerDown child');
    //     children.props.onPointerDown(...args);
    //   }
    // },
    onPointerLeave: (...args) => {
      log('onPointerLeave');
      handlePointerLeave(...args);
      if (children.props.onPointerLeave) {
        log('onPointerLeave child');
        children.props.onPointerLeave(...args);
      }
    },
    onFocus: (...args) => {
      log('onFocus');
      handleFocus(...args);
      if (children.props.onFocus) {
        log('onFocus child');
        children.props.onFocus(...args);
      }
    },
    onBlur: (...args) => {
      log('onBlur');
      handlePointerLeave(...args);
      if (children.props.onBlur) {
        log('onBlur child');
        children.props.onBlur(...args);
      }
    },
  });

  return (
    <>
      <Profiler id="Tooltip" onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime) => {
        // console.log(id, phase, actualDuration);
      }}>
      {childWithProps}
      {isVisible && createPortal(
        <Paper style ={baseStyles} ref = {tooltipRef}>
          {text}
        </Paper>,
        document.body,
      )}
      </Profiler>
    </>
  );
};

export default Tooltip;
