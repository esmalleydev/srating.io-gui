'use client';

import { Typography, useTheme } from '@mui/material';

const ButtonSwitch = (
  { leftTitle, rightTitle, selected, handleClick, fontSize = '0.85rem', style = {} }:
  { leftTitle: string, rightTitle: string, selected: string, handleClick: (value: string) => void, fontSize?: string, style?: React.CSSProperties },
) => {
  const theme = useTheme();

  const unSelectedColor = theme.palette.mode === 'light' ? theme.palette.grey['300'] : theme.palette.grey['900'];
  const selectedColor = theme.palette.info.dark;

  const leftBackgroundColor = (selected === leftTitle ? selectedColor : unSelectedColor);
  const rightBackgroundColor = (selected === rightTitle ? selectedColor : unSelectedColor);

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
    <div style = {({ width: '100%', maxWidth: 300, margin: 'auto', ...style })}>
      <div style = {containerStyle}>
        <div style = {({ backgroundColor: leftBackgroundColor, ...buttonStyle })} onClick={() => { handleClick(leftTitle); }}>
          <Typography style = {{ color: theme.palette.getContrastText(leftBackgroundColor), fontSize }} variant = 'button'>{leftTitle}</Typography>
        </div>
        <div style = {({ backgroundColor: rightBackgroundColor, ...buttonStyle })} onClick={() => { handleClick(rightTitle); }}>
          <Typography style = {({ color: theme.palette.getContrastText(rightBackgroundColor), fontSize })} variant = 'button'>{rightTitle}</Typography>
        </div>
      </div>
    </div>
  );
};

export default ButtonSwitch;
