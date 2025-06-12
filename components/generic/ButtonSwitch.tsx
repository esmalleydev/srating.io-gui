'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Typography from '@/components/ux/text/Typography';
import Color from '@/components/utils/Color';

const ButtonSwitch = (
  { leftTitle, rightTitle, selected, handleClick, fontSize = '0.85rem', style = {} }:
  { leftTitle: string, rightTitle: string, selected: string, handleClick: (value: string) => void, fontSize?: string, style?: React.CSSProperties },
) => {
  const theme = useTheme();

  const unSelectedColor = theme.mode === 'light' ? theme.grey['300'] : theme.grey['900'];
  const selectedColor = theme.info.dark;

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
          <Typography style = {{ color: Color.getTextColor(theme.text.primary, leftBackgroundColor), fontSize }} type = 'button'>{leftTitle}</Typography>
        </div>
        <div style = {({ backgroundColor: rightBackgroundColor, ...buttonStyle })} onClick={() => { handleClick(rightTitle); }}>
          <Typography style = {({ color: Color.getTextColor(theme.text.primary, rightBackgroundColor), fontSize })} type = 'button'>{rightTitle}</Typography>
        </div>
      </div>
    </div>
  );
};

export default ButtonSwitch;
