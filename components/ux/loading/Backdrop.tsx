'use client';

import { Objector, Style } from '@esmalley/ts-utils';
import React from 'react';


const Backdrop = (
  {
    open = false,
    children,
    onClick,
    style = {},
  }:
  {
    open: boolean;
    children: React.JSX.Element;
    onClick?: () => void;
    style?: React.CSSProperties;
  },
) => {
  if (!open) {
    return null;
  }

  const cStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    WebkitTapHighlightColor: 'transparent',
    zIndex: Style.getZIndex().modal,
    transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  };

  Objector.extender(cStyle, style);

  return (
    <div
      className = {Style.getStyleClassName(cStyle)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Backdrop;
