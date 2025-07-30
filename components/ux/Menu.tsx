'use client';

// import { useTheme } from '@/components/hooks/useTheme';
import Paper from './container/Paper';
import ReactDOM from 'react-dom';
import Style from '../utils/Style';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, useWindowDimensions } from '../hooks/useWindowDimensions';
// import Style from '@/components/utils/Style';

const getOffsetTop = (rect, vertical) => {
  let offset = 36;

  if (typeof vertical === 'number') {
    offset = vertical;
  } else if (vertical === 'center') {
    offset = rect.height / 2;
  } else if (vertical === 'bottom') {
    offset = rect.height;
  }

  return offset;
};

const getOffsetLeft = (rect, horizontal) => {
  let offset = 0;

  if (typeof horizontal === 'number') {
    offset = horizontal;
  } else if (horizontal === 'center') {
    offset = rect.width / 2;
  } else if (horizontal === 'right') {
    offset = rect.width;
  }

  return offset;
};

type anchorOrigin = {
  vertical: string | number;
  horizontal: string | number;
}

const transitionDurationMS = 285;
const menuPadding = 16;

const Menu = (
  {
    open = false,
    anchor,
    onClose,
    anchorOrigin = {
      vertical: 'top',
      horizontal: 'left',
    },
    style = {},
    children,
  }:
  {
    open: boolean;
    anchor: HTMLElement | null;
    onClose: () => void;
    anchorOrigin?: anchorOrigin;
    style?: React.CSSProperties;
    children: React.ReactNode;
  },
) => {
  const menuRootRef = useRef<HTMLElement | null>(null);
  const menuContentRef = useRef<HTMLDivElement | null>(null);

  // State to control if the component is mounted in the DOM
  const [_shouldMount, setShouldMount] = useState(open);
  // State to control the CSS opacity (for transitions)
  const [_isVisible, setIsVisible] = useState(open);
  // Store the actual calculated position after adjustment
  const [finalPosition, setFinalPosition] = useState<{ top: number; left: number } | null>(null);

  const [finalDimensions, setFinalDimensions] = useState<{ maxHeight?: number; maxWidth?: number } | null>(null);

  // Store the determined transform origin for CSS
  const [finalTransformOrigin, setFinalTransformOrigin] = useState<{ x: string, y: string }>({ x: 'left', y: 'top' });

  const { width } = useWindowDimensions() as Dimensions;

  // const theme = useTheme();


  const paperStyle: React.CSSProperties = {
    position: 'absolute',
    overflowY: 'auto',
    overflowX: 'hidden',
    minWidth: 16,
    minHeight: 16,
    maxHeight: finalDimensions?.maxHeight || 'calc(100% - 32px)',
    maxWidth: finalDimensions?.maxWidth || 'calc(100% - 32px)',
    outline: 0,
    opacity: _isVisible ? 1 : 0,
    transformOrigin: `${finalTransformOrigin.x} ${finalTransformOrigin.y}`,
    transition: `opacity ${transitionDurationMS}ms cubic-bezier(0.4, 0, 0.2, 1), transform 190ms cubic-bezier(0.4, 0, 0.2, 1)`,
  };

  if (finalPosition) {
    paperStyle.top = finalPosition.top;
    paperStyle.left = finalPosition.left;
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuContentRef.current &&
      !menuContentRef.current.contains(event.target as Node) &&
      anchor &&
      !anchor.contains(event.target as Node)
    ) {
      onClose(); // Call the onClose handler passed from the parent
    }
  };


  // Effect to get the 'menu-root' DOM node once on mount
  useEffect(() => {
    menuRootRef.current = document.getElementById('menu-root');
  }, []);

  // Effect to manage shouldRender based on 'open' prop
  useEffect(() => {
    if (open) {
      setShouldMount(true); // Mount the component in the DOM
      // Use setTimeout with 0 delay to allow DOM to update before starting transition
      // This helps trigger the CSS transition from opacity 0 to 1
      const timer = setTimeout(() => {
        setIsVisible(true); // Start fade-in
      }, 0);
      return () => clearTimeout(timer);
    }

    setIsVisible(false); // Start fade-out (set opacity to 0)
    // After the animation duration, unmount the component from the DOM
    const timer = setTimeout(() => {
      setShouldMount(false);
      setFinalPosition(null); // Clear position after unmount
      setFinalDimensions(null); // Clear dimensions after unmount
    }, transitionDurationMS + 15);
    return () => clearTimeout(timer); // Cleanup timer if 'open' changes again
  }, [open]);

  useEffect(() => {
    if (open && _shouldMount && anchor && menuContentRef.current) {
      const anchorRect = anchor.getBoundingClientRect();
      const menuRect = menuContentRef.current.getBoundingClientRect();

      let calculatedTop = anchorRect.top + getOffsetTop(anchorRect, anchorOrigin.vertical);
      let calculatedLeft = anchorRect.left + getOffsetLeft(anchorRect, anchorOrigin.horizontal);

      let finalMaxHeight: number | undefined = undefined;

      let originX = anchorOrigin.horizontal;
      let originY = anchorOrigin.vertical;

      // --- Vertical Positioning Adjustments (Prioritize below anchor, adjust height) ---
      const spaceBelow = window.innerHeight - calculatedTop - menuPadding;
      const spaceAbove = calculatedTop - menuPadding;

      if (calculatedTop + menuRect.height > window.innerHeight - menuPadding) {
        // Menu overflows bottom
        if (spaceBelow >= menuRect.height) { // If there's just enough space below without adjusting height
          // Don't adjust maxHeight, keep default
        } else if (spaceBelow > spaceAbove) {
          // More space below than above, so keep it below but limit height
          finalMaxHeight = spaceBelow;
          // Also, ensure the menu's top aligns with the anchor's bottom for common scenarios
          if (anchorOrigin.vertical === 'top') { // If originally attached to top of anchor
            calculatedTop = anchorRect.bottom; // Align menu top with anchor bottom
          }
        } else {
          // More space above, but we don't want to go above the anchor.
          // Adjust `calculatedTop` upwards to bring the bottom into view, but not above anchor's top
          calculatedTop = Math.max(menuPadding, window.innerHeight - menuRect.height - menuPadding);
          // Ensure calculatedTop doesn't go above anchorRect.top for this specific requirement
          calculatedTop = Math.max(calculatedTop, anchorRect.top);
          finalMaxHeight = window.innerHeight - calculatedTop - menuPadding;
          originY = 'bottom'; // If it's pushed up, consider transforming from bottom
        }
      }

      // If, after all adjustments, the top is still off-screen (shouldn't happen with current logic, but as safeguard)
      if (calculatedTop < menuPadding) {
        calculatedTop = menuPadding;
        finalMaxHeight = window.innerHeight - calculatedTop - menuPadding;
        originY = 'top';
      }

      // --- Horizontal Positioning Adjustments (Same as before) ---
      if (calculatedLeft + menuRect.width > window.innerWidth - menuPadding) {
        calculatedLeft = window.innerWidth - menuRect.width - menuPadding;
        originX = 'right'; // If pushed to left, origin from right
      }
      if (calculatedLeft < menuPadding) {
        calculatedLeft = menuPadding;
        originX = 'left'; // If pushed to right, origin from left
      }


      setFinalPosition({ top: calculatedTop, left: calculatedLeft });
      setFinalDimensions({ maxHeight: finalMaxHeight, maxWidth: width });
      setFinalTransformOrigin({ x: String(originX), y: String(originY) });

      // Now that position is calculated, start fade-in
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 0);
      return () => clearTimeout(timer);
    }
    if (!open) {
      setIsVisible(false); // When closing, ensure _isVisible goes to false.
    }

    return undefined;
  }, [open, _shouldMount, anchor, anchorOrigin.vertical, anchorOrigin.horizontal]);

  // Effect to handle clicks outside the menu content to close it
  useEffect(() => {
    if (open && menuRootRef.current) {
      // Add event listener to the document (or the overlay div)
      // We add it to the menuRoot (the portal's target) to capture events on the overlay
      menuRootRef.current.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener when the component unmounts or menu closes
    return () => {
      if (menuRootRef.current) {
        menuRootRef.current.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [open, onClose, menuRootRef]);


  // Also handle Escape key press to close the menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      console.log(event)
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [open, onClose]);


  // const handleEntering = (element, isAppearing) => {
  //   if (menuListActionsRef.current) {
  //     menuListActionsRef.current.adjustStyleForScrollbar(element, {
  //       direction: isRtl ? 'rtl' : 'ltr',
  //     });
  //   }

  //   if (onEntering) {
  //     onEntering(element, isAppearing);
  //   }
  // };

  // const handleListKeyDown = (event) => {
  //   if (event.key === 'Tab') {
  //     event.preventDefault();

  //     if (onClose) {
  //       onClose(event, 'tabKeyDown');
  //     }
  //   }
  // };


  // let activeItemIndex = -1;
  // React.Children.map(children, (child, index) => {
  //   if (!React.isValidElement(child)) {
  //     return;
  //   }

  //   if (process.env.NODE_ENV !== 'production') {
  //     if (isFragment(child)) {
  //       console.error(
  //         [
  //           "MUI: The Menu component doesn't accept a Fragment as a child.",
  //           'Consider providing an array instead.',
  //         ].join('\n'),
  //       );
  //     }
  //   }

  //   if (!child.props.disabled) {
  //     if (variant === 'selectedMenu' && child.props.selected) {
  //       activeItemIndex = index;
  //     } else if (activeItemIndex === -1) {
  //       activeItemIndex = index;
  //     }
  //   }
  // });


  if (!_shouldMount || !menuRootRef.current) {
    return null;
  }

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1300,
    // transition: 'background-color 285ms cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return ReactDOM.createPortal(
    <div className={Style.getStyleClassName(overlayStyle)}>
      <Paper style={paperStyle} ref = {menuContentRef} tranparency={0.95}>
        {children}
      </Paper>
    </div>,
    menuRootRef.current,
  );
};

export default Menu;
