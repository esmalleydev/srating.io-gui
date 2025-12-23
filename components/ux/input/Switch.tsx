/* eslint-disable no-nested-ternary */

'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Style from '@/components/utils/Style';
import Typography from '../text/Typography'; // Adjust path if needed
import { useState } from 'react';

interface SwitchProps {
  // Label to display next to the switch
  label?: string;
  // Controlled state
  checked?: boolean;
  // Uncontrolled initial state
  defaultChecked?: boolean;
  // Callback when changed
  onChange?: (checked: boolean) => void;
  // Disable interaction
  disabled?: boolean;
  // Custom styles for the container
  style?: React.CSSProperties;
  // Label placement
  labelPlacement?: 'start' | 'end';
}

// todo make keyboard tab work on this component

const Switch: React.FC<SwitchProps> = ({
  label,
  checked: checkedProp,
  defaultChecked,
  onChange,
  disabled = false,
  style = {},
  labelPlacement = 'start',
}) => {
  const theme = useTheme();

  // --- State Management (Controlled vs Uncontrolled) ---
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
  const isChecked = checkedProp !== undefined ? checkedProp : internalChecked;

  // --- Handlers ---
  const handleToggle = () => {
    if (disabled) return;

    const newValue = !isChecked;

    // Update internal state if uncontrolled
    if (checkedProp === undefined) {
      setInternalChecked(newValue);
    }

    // Trigger callback
    if (onChange) {
      onChange(newValue);
    }
  };

  // --- Styling ---

  // 1. The Track (The background pill)
  const trackWidth = 44;
  const trackHeight = 24;
  const padding = 2; // Space between thumb and track edge

  const trackColor = isChecked
    ? theme.info.main // Active Color
    : (theme.mode === 'dark' ? theme.grey[700] : theme.grey[400]); // Inactive Color

  const trackStyle: React.CSSProperties = {
    width: trackWidth,
    height: trackHeight,
    backgroundColor: disabled ? theme.grey[300] : trackColor,
    borderRadius: 999, // Pill shape
    position: 'relative',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.3s ease',
    opacity: disabled ? 0.6 : 1,
    flexShrink: 0, // Prevent squishing if in a flex container
  };

  // 2. The Thumb (The moving circle)
  const thumbSize = trackHeight - (padding * 2);

  const thumbStyle: React.CSSProperties = {
    width: thumbSize,
    height: thumbSize,
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    top: padding,
    left: padding,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)', // Bouncy effect

    // Move the thumb if checked
    transform: isChecked
      ? `translateX(${trackWidth - thumbSize - (padding * 2)}px)`
      : 'translateX(0)',
  };

  // 3. Container (Holds Label + Switch)
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexDirection: labelPlacement === 'start' ? 'row' : 'row-reverse',
    justifyContent: labelPlacement === 'start' ? 'space-between' : 'flex-end',
    width: '100%',
    padding: '8px 0',
    ...style, // Allow overrides
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent scrolling when pressing Space
      handleToggle();
    }
  };

  return (
    <div className={Style.getStyleClassName(containerStyle)} onClick={handleToggle}>
      {label && (
        <Typography
          type="body1"
          style={{
            color: disabled ? theme.text.disabled : theme.text.primary,
            cursor: disabled ? 'not-allowed' : 'pointer',
            userSelect: 'none', // Prevent text highlighting on rapid clicks
          }}
        >
          {label}
        </Typography>
      )}
      {/* The Switch Graphic */}
      <div className={Style.getStyleClassName(trackStyle)} tabIndex={0} onKeyDown={handleKeyDown}>
        <div className={Style.getStyleClassName(thumbStyle)} />
      </div>
    </div>
  );
};

export default Switch;

