'use client';

import { Typography, useTheme } from '@mui/material';

const ButtonSwitch = (
  { leftTitle, rightTitle, selected, handleClick }:
  { leftTitle: string, rightTitle: string, selected: string, handleClick: (value: string) => void },
) => {
  const theme = useTheme();

  const unSelectedColor = theme.palette.info.light;
  const selectedColor = theme.palette.info.dark;

  const leftBackgroundColor = selected === 'left' ? selectedColor : unSelectedColor;
  const rightBackgroundColor = selected === 'right' ? selectedColor : unSelectedColor;

  const containerStyle: React.CSSProperties = {
    width: '100%',
    border: `2px solid ${selectedColor}`,
    borderRadius: '3px',
    display: 'flex',
    justifyContent: 'space-between',
  };

  const buttonStyle: React.CSSProperties = {
    width: '50%',
    textAlign: 'center',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    padding: 5,
    opacity: 0.9,
  };

  return (
    <div style = {{ width: '100%', maxWidth: 300, margin: 'auto' }}>
      <div style = {containerStyle}>
        <div style = {({ backgroundColor: leftBackgroundColor, ...buttonStyle })} onClick={() => { handleClick('left'); }}>
          <Typography style = {{ color: theme.palette.getContrastText(leftBackgroundColor) }} variant = 'button'>{leftTitle}</Typography>
        </div>
        <div style = {({ backgroundColor: rightBackgroundColor, ...buttonStyle })} onClick={() => { handleClick('right'); }}>
          <Typography style = {({ color: theme.palette.getContrastText(rightBackgroundColor) })} variant = 'button'>{rightTitle}</Typography>
        </div>
      </div>
    </div>
  );
};

export default ButtonSwitch;
