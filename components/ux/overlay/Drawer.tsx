'use client';

import { Style } from '@esmalley/ts-utils';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Paper from '../container/Paper';

const Drawer = (
  {
    open,
    position = 'left',
    onClose,
    children,
  }:
  {
    open: boolean;
    position?: string;
    onClose: () => void;
    children: React.JSX.Element;
  },
) => {
  // Prevent background scrolling when the drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const backdropStyle = {
    position: 'fixed',
    inset: 0, /* same as top: 0, right: 0, bottom: 0, left: 0 */
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: Style.getZIndex().drawer,
    opacity: open ? 1 : 0,
    visibility: open ? 'visible' : 'hidden',
    transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: Style.getZIndex().drawer + 1,
    boxShadow: '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    overflowY: 'auto',
  };

  if (position === 'top') {
    containerStyle.top = 0;
    containerStyle.left = 0;
    containerStyle.right = 0;
    containerStyle.transform = 'translateY(-100%)';
  } else if (position === 'left') {
    containerStyle.top = 0;
    containerStyle.left = 0;
    containerStyle.bottom = 0;
    containerStyle.transform = 'translateX(-100%)';
  } else if (position === 'right') {
    containerStyle.top = 0;
    containerStyle.right = 0;
    containerStyle.bottom = 0;
    containerStyle.transform = 'translateX(100%)';
  } else if (position === 'bottom') {
    containerStyle.left = 0;
    containerStyle.right = 0;
    containerStyle.bottom = 0;
    containerStyle.transform = 'translateY(100%)';
  }

  if (open && (position === 'left' || position === 'right')) {
    containerStyle.transform = 'translateX(0)';
  }

  if (open && (position === 'top' || position === 'bottom')) {
    containerStyle.transform = 'translateY(0)';
  }

  return createPortal(
    <>
      <div
        className={Style.getStyleClassName(backdropStyle)}
        onClick={onClose}
      />
      <Paper style = {containerStyle}>
        {children}
      </Paper>
    </>,
    document.body,
  );
};

export default Drawer;
