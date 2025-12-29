'use client';

// import { useTheme } from '@/components/hooks/useTheme';
import ReactDOM from 'react-dom';
import React, { useEffect, useRef, useState } from 'react';
import Style from '@/components/utils/Style';
import Paper from '@/components/ux/container/Paper';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import CloseIcon from '@mui/icons-material/Close';
// import Plane from '../overlay/Plane';
import Objector from '@/components/utils/Objector';
import MenuList from './MenuList';
import MenuItem from './MenuItem';
import MenuListIcon from './MenuListIcon';
import MenuListText from './MenuListText';
import { useTheme } from '@/components/hooks/useTheme';

type MenuValue = string | number | null;

export type MenuOption = {
  value: MenuValue;
  selectable: boolean;
  disabled?: boolean;
  label?: string;
  onSelect?: (value: MenuValue) => void;
  secondaryLabel?: string;
  icon?: React.JSX.Element;
  customLabel?: React.JSX.Element;
}

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

export const MenuDivider = () => {
  const theme = useTheme();
  return <hr style = {{ margin: 0, borderWidth: 0, borderStyle: 'solid', borderColor: theme.grey[600], borderBottomWidth: 'thin' }} />;
};

type anchorOrigin = {
  vertical: string | number;
  horizontal: string | number;
}

const transitionDurationMS = 0;
const menuPadding = 16;

const Menu = (
  {
    open = false,
    options,
    anchor,
    onClose,
    anchorOrigin = {
      vertical: 'top',
      horizontal: 'left',
    },
    showCloseButton = false,
    style = {},
    ...props
  }:
  {
    open: boolean;
    options: MenuOption[];
    anchor: HTMLElement | null;
    onClose: () => void;
    anchorOrigin?: anchorOrigin;
    showCloseButton?: boolean;
    style?: React.CSSProperties;
  },
) => {
  const menuRootRef = useRef<HTMLElement | null>(null);
  const menuContentRef = useRef<HTMLDivElement | null>(null);

  const [hasWidth, setHasWidth] = useState(false);

  // Store the actual calculated position after adjustment
  const [finalPosition, setFinalPosition] = useState<{ top: number; left: number } | null>(null);

  const [finalDimensions, setFinalDimensions] = useState<{ maxHeight?: number; maxWidth?: number } | null>(null);

  const [activeIndex, setActiveIndex] = useState(-1); // For keyboard navigation

  // Store the determined transform origin for CSS
  // const [finalTransformOrigin, setFinalTransformOrigin] = useState<{ x: string, y: string } | null>(null);

  const { width } = useWindowDimensions() as Dimensions;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    display: 'none',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1300,
    // transition: 'background-color 285ms cubic-bezier(0.4, 0, 0.2, 1)',
  };


  const paperStyle: React.CSSProperties = Objector.extender({
    display: 'none',
    position: 'absolute',
    overflowY: 'auto',
    overflowX: 'hidden',
    minWidth: 16,
    minHeight: 16,
    width: 'auto',
    maxHeight: finalDimensions?.maxHeight || 'calc(100% - 32px)',
    maxWidth: finalDimensions?.maxWidth || 'calc(100% - 32px)',
    outline: 0,
    opacity: 0,
    // opacity: _isVisible ? 1 : 0,
    // transition: `opacity ${transitionDurationMS}ms cubic-bezier(0.4, 0, 0.2, 1), transform 190ms cubic-bezier(0.4, 0, 0.2, 1)`,
    // scrollbarGutter: 'stable',
  },
    style
  );


  if (finalPosition && open && finalDimensions) {
    paperStyle.display = 'block';
    overlayStyle.display = 'block';

    // only make it visible after all the shifting and adjustments have been made
    if (hasWidth) {
      paperStyle.opacity = 1;
    }
    // paperStyle.transformOrigin = `${finalTransformOrigin.x} ${finalTransformOrigin.y}`;
    paperStyle.top = finalPosition.top;
    paperStyle.left = finalPosition.left;
  }

  const handleClose = () => {
    setFinalPosition(null);
    setFinalDimensions(null);
    setHasWidth(false);
    onClose();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuContentRef.current &&
      !menuContentRef.current.contains(event.target as Node) &&
      anchor &&
      !anchor.contains(event.target as Node)
    ) {
      console.log('click outside')
      handleClose();
    }
  };


  // Effect to get the 'menu-root' DOM node once on mount
  useEffect(() => {
    menuRootRef.current = document.getElementById('menu-root');
  }, []);

  useEffect(() => {
    if (open && anchor && menuContentRef.current) {
      const anchorRect = anchor.getBoundingClientRect();
      const menuRect = menuContentRef.current.getBoundingClientRect();

      if (menuRect.width) {
        setHasWidth(true);
      }

      let calculatedTop = anchorRect.top + getOffsetTop(anchorRect, anchorOrigin.vertical);
      let calculatedLeft = anchorRect.left + getOffsetLeft(anchorRect, anchorOrigin.horizontal);


      let finalMaxHeight: number | undefined = undefined;

      // let finalOriginX: string | undefined = undefined;
      // let finalOriginY: string | undefined = undefined;

      // let originX = anchorOrigin.horizontal;
      // let originY = anchorOrigin.vertical;


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
          // finalOriginY = 'bottom'; // If it's pushed up, consider transforming from bottom
        }
      }

      // If, after all adjustments, the top is still off-screen (shouldn't happen with current logic, but as safeguard)
      if (calculatedTop < menuPadding) {
        calculatedTop = menuPadding;
        finalMaxHeight = window.innerHeight - calculatedTop - menuPadding;
        // finalOriginY = 'top';
      }

      // --- Horizontal Positioning Adjustments (Same as before) ---
      if (calculatedLeft + menuRect.width > window.innerWidth - menuPadding) {
        calculatedLeft = window.innerWidth - menuRect.width - menuPadding;
        // finalOriginX = 'right'; // If pushed to left, origin from right
      }
      if (calculatedLeft < menuPadding) {
        calculatedLeft = menuPadding;
        // finalOriginX = 'left'; // If pushed to right, origin from left
      }

      setFinalPosition({ top: calculatedTop, left: calculatedLeft });
      setFinalDimensions({ maxHeight: finalMaxHeight, maxWidth: width - 36 });

      // if (finalOriginX && finalOriginY) {
      //   setFinalTransformOrigin({ x: String(finalOriginX), y: String(finalOriginY) });
      // }
    }
  }, [open, anchor, menuRootRef, menuContentRef.current, width]);


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

  const getNextIndex = (current: number) => {
    let nextIndex = current + 1;
    if (!options[nextIndex]) {
      return current;
    }

    if (options[nextIndex].selectable) {
      return nextIndex;
    }

    return getNextIndex(nextIndex);
  };

  const getPrevIndex = (current: number) => {
    let prevIndex = current - 1;
    if (!options[prevIndex]) {
      return current;
    }

    if (options[prevIndex].selectable) {
      return prevIndex;
    }

    return getPrevIndex(prevIndex);
  };


  // handle keyboard navigation selections
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeIndex < options.length - 1) {
        setActiveIndex(getNextIndex(activeIndex));
      }
    }

    if (e.key === 'ArrowUp') {  
      e.preventDefault();
      if (activeIndex > 0) {
        setActiveIndex(getPrevIndex(activeIndex));
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (options[activeIndex].onSelect) {
        options[activeIndex].onSelect(options[activeIndex].value);
      }
    }

    // escape is already hanlded below
  };


  useEffect(() => {
    if (!open) {
      return;
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, activeIndex]);


  // Also handle Escape key press to close the menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [open, onClose]);

  if (
    !menuRootRef.current ||
    !open
  ) {
    return null;
  }


  const closeContainerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    right: 0,
    width: 40,
    height: 50,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    float: 'right',
    zIndex: 9999,
  };

  const closeContainer = (
    <div className={Style.getStyleClassName(closeContainerStyle)} onClick={onClose}>
      <CloseIcon />
    </div>
  );

  return ReactDOM.createPortal(
    <div className={Style.getStyleClassName(overlayStyle)} {...props}>
      <Paper style={paperStyle} ref = {menuContentRef} tranparency={0.95}>
        {showCloseButton ? closeContainer : ''}
        <MenuList>
          {options.map((option, index) => {
            const handleIt = () => {
              if (option.onSelect && !option.disabled) {
                option.onSelect(option.value);
              }
            };

            if (option.customLabel) {
              return (
                <div onClick={handleIt}>
                  {option.customLabel}
                </div>
              );
            }
            return (
              <MenuItem onClick={handleIt} active = {activeIndex === index} disabled = {option.disabled}>
                {option.icon ? <MenuListIcon>{option.icon}</MenuListIcon> : ''}
                <MenuListText primary={option.label || 'Unknown'} secondary={option.secondaryLabel || undefined} />
              </MenuItem>
            );
          })}
        </MenuList>
      </Paper>
    </div>,
    menuRootRef.current,
  );

  // return (
  //   <Plane open = {open} onClose={onClose} anchor = {anchor}>
  //     <div className={Style.getStyleClassName(overlayStyle)} {...props}>
  //       <Paper style={paperStyle} ref = {menuContentRef} tranparency={0.95}>
  //         {showCloseButton ? closeContainer : ''}
  //         {children}
  //       </Paper>
  //     </div>
  //   </Plane>
  // );
};

export default Menu;
