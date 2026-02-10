'use client';

// import { useTheme } from '@/components/hooks/useTheme';
import Style from '@/components/utils/Style';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import Objector from '@/components/utils/Objector';
import Paper from '../container/Paper';


const Modal = (
  {
    open,
    onClose,
    type = 'paper',
    paperStyle = {},
    children,
  }:
  {
    open: boolean;
    onClose: (e: React.SyntheticEvent) => void;
    type?: 'paper' | 'custom';
    paperStyle?: React.CSSProperties;
    // anchor: HTMLElement | null;
    children: React.ReactNode;
  },
) => {
  // const theme = useTheme();
  const contentRef = useRef<HTMLDivElement | null>(null);

  const zIndex = Style.getZIndex().modal;


  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    transition: 'opacity 0.2s',
    opacity: open ? 1 : 0,
    pointerEvents: open ? 'auto' : 'none', // Prevent clicks while fading out
  };

  const centeringStyle = {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: '0px 10px',
    // top: styleState.top,
    // left: styleState.left,
    // transformOrigin: styleState.transformOrigin,
    // opacity: open ? styleState.opacity : 1,
    /* The "Pop" Animation */
    // animation: animationString,

    // Define both keyframes here
    // '@keyframes pop-in': {
    //   '0%': { transform: `scale(${transformScale})`, opacity: 0 },
    //   '100%': { transform: 'scale(1)', opacity: 1 },
    // },
    // '@keyframes pop-out': {
    //   '0%': { transform: 'scale(1)', opacity: 1 },
    //   '100%': { transform: `scale(${transformScale})`, opacity: 0 },
    // },
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

  const contentStyle = {

  };


  if (!open) {
    return null;
  }

  const getContents = () => {
    if (type === 'paper') {
      return (
        <Paper style={Objector.extender({ minWidth: 320, maxWidth: 500, minHeight: 100, padding: 16 }, paperStyle)}>
          {children}
        </Paper>
      );
    }

    return <>{children}</>;
  };


  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onClose(e);
  };



  return createPortal(
    <div className = {Style.getStyleClassName(backdropStyle)} onClick={handleClose}>
      <div className = {Style.getStyleClassName(centeringStyle)}>
        <div
          className = {Style.getStyleClassName(contentStyle)}
          onClick = {(e) => {
            e.stopPropagation();
            e.nativeEvent.stopPropagation();
          }}
          // onAnimationEnd={handleAnimationEnd}
          ref={contentRef}
        >
          {getContents()}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
