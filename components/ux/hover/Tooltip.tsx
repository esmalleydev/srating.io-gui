'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Paper from '@/components/ux/container/Paper';

// todo on hover might need an if width < 500 to disable if hover amount is longer than x seconds, gets buggy while scrolling

const Tooltip = <T extends HTMLElement>(
  {
    text,
    position = 'bottom',
    delay = 250,
    onClickFade = 5000,
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
    disableOnFocus?: boolean;
    onClickRemove?: boolean;
    style?: React.CSSProperties;
    children: React.ReactElement<{
      ref?: React.Ref<T>;
      onClick?: () => void;
      onPointerEnter?: () => void;
      onPointerLeave?: () => void;
      onFocus?: () => void;
      onBlur?: () => void;
    }>;
  },
) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef<T>(null);

  const baseStyles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 9999,
    padding: '6px 12px',
    fontSize: '14px',
    transition: 'opacity 300ms ease-in-out',
    minWidth: 'max-content',
    textAlign: 'center',
    pointerEvents: 'none',
    opacity: isVisible ? 1 : 0,
    top: coords.top,
    left: coords.left,
    ...style,
  };

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const targetRect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const tooltipStyles = {
        padding: '6px 12px',
        fontSize: '14px',
        minWidth: 'max-content',
        textAlign: 'center',
      };

      const tempTooltip = document.createElement('div');
      tempTooltip.style.visibility = 'hidden';
      tempTooltip.style.position = 'absolute';
      tempTooltip.style.top = '-9999px';
      Object.assign(tempTooltip.style, tooltipStyles);
      tempTooltip.innerText = text;
      document.body.appendChild(tempTooltip);

      const tooltipWidth = tempTooltip.offsetWidth;
      const tooltipHeight = tempTooltip.offsetHeight;
      document.body.removeChild(tempTooltip);

      let newTop = 0;
      let newLeft = 0;

      switch (position) {
        case 'bottom':
          newTop = targetRect.bottom + 8;
          newLeft = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
          break;
        case 'left':
          newTop = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
          newLeft = targetRect.left - tooltipWidth - 8;
          break;
        case 'right':
          newTop = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
          newLeft = targetRect.right + 8;
          break;
        case 'top':
        default:
          newTop = targetRect.top - tooltipHeight - 8;
          newLeft = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
          break;
      }

      // Adjust position to stay within the viewport
      if (newTop < 0) {
        newTop = 8;
      }
      if (newTop + tooltipHeight > viewportHeight) {
        newTop = viewportHeight - tooltipHeight - 8;
      }
      if (newLeft < 0) {
        newLeft = 8;
      }
      if (newLeft + tooltipWidth > viewportWidth) {
        newLeft = viewportWidth - tooltipWidth - 8;
      }

      setCoords({ top: newTop + window.scrollY, left: newLeft + window.scrollX });
    }
  }, [isVisible, position, text]);

  let timeout: null | NodeJS.Timeout = null;
  let fadeTimeout: null | NodeJS.Timeout = null;

  const handleShow = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(
      () => setIsVisible(true),
      delay,
    );
  };

  const handleHide = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    setIsVisible(false);
  };

  const handleFocus = () => {
    if (disableOnFocus) {
      return;
    }

    if (fadeTimeout) {
      clearTimeout(fadeTimeout);
    }

    handleShow();
  };

  const handlePointerEnter = () => {
    if (fadeTimeout) {
      clearTimeout(fadeTimeout);
    }
    handleShow();
  };

  const handlePointerLeave = () => {
    if (fadeTimeout) {
      clearTimeout(fadeTimeout);
    }
    handleHide();
  };

  const handleClick = () => {
    if (onClickRemove) {
      handleHide();
    }

    if (onClickFade) {
      if (fadeTimeout) {
        clearTimeout(fadeTimeout);
      }

      fadeTimeout = setTimeout(
        handleHide,
        onClickFade,
      );
    }
  };

  // Use cloneElement to add props to the child without wrapping it
  const childWithProps = React.cloneElement(children, {
    ref: containerRef,
    onClick: (...args) => {
      // Call the parent's event handler
      handleClick(...args);
      // Call the child's original event handler if it exists
      if (children.props.onClick) {
        children.props.onClick(...args);
      }
    },
    onPointerEnter: (...args) => {
      handlePointerEnter(...args);
      if (children.props.onPointerEnter) {
        children.props.onPointerEnter(...args);
      }
    },
    onPointerLeave: (...args) => {
      handlePointerLeave(...args);
      if (children.props.onPointerLeave) {
        children.props.onPointerLeave(...args);
      }
    },
    onFocus: (...args) => {
      handleFocus(...args);
      if (children.props.onFocus) {
        children.props.onFocus(...args);
      }
    },
    onBlur: (...args) => {
      handlePointerLeave(...args);
      if (children.props.onBlur) {
        children.props.onBlur(...args);
      }
    },
  });

  return (
    <>
      {childWithProps}
      {isVisible && createPortal(
        <Paper style ={baseStyles}>
          {text}
        </Paper>,
        document.body,
      )}
    </>
  );
};

export default Tooltip;
