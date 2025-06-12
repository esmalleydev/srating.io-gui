'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Color from '@/components/utils/Color';
import Style from '@/components/utils/Style';
import Typography from '@/components/ux/text/Typography';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from 'react';

const Chip = (
  {
    title,
    value,
    filled = false,
    onClick,
    onDelete,
    style = {},
  }:
  {
    title: string;
    value: string|number;
    filled?: boolean;
    onClick?: (e: React.SyntheticEvent, value: string | number) => void
    onDelete?: (e: React.SyntheticEvent, value: string | number) => void
    style?: React.CSSProperties;
  },
) => {
  const theme = useTheme();
  const [hover, setHover] = useState(false);

  const height = 32;

  const color = theme.mode === 'dark' ? theme.info.light : theme.info.dark;
  const filledHoverColor = theme.mode === 'dark' ? theme.success.light : theme.success.dark;


  const cStyle: React.CSSProperties = {
    color,
    padding: onDelete ? '0px 6px 0px 12px' : '0px 12px',
    margin: 0,
    height,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: height / 2,
    ...style,
  };

  const textStyle: React.CSSProperties = {
    color: cStyle.color,
    fontWeight: 500,
    lineHeight: 'initial',
  };

  if (onClick || onDelete) {
    cStyle.cursor = 'pointer';
  }

  if (hover) {
    const percent = theme.mode === 'dark' ? 15 : -20;
    if (cStyle.color) {
      cStyle.color = Color.shadeColor(cStyle.color, percent);
    }

    if (textStyle.color) {
      textStyle.color = Color.shadeColor(textStyle.color, percent);
    }
  }

  if (filled) {
    cStyle.backgroundColor = hover ? filledHoverColor : theme.success.main;
    cStyle.color = Color.getTextColor(theme.text.primary, cStyle.backgroundColor);
    textStyle.color = Color.getTextColor(theme.text.primary, cStyle.backgroundColor);
  } else {
    cStyle.border = `1px solid ${cStyle.color}`;
  }


  const handleClick = (e) => {
    if (onClick) {
      onClick(e, value);
    }

    if (onDelete) {
      onDelete(e, value);
    }
  };

  const handleMouseEnter = (e) => {
    if (onClick || onDelete) {
      setHover(true);
    }
  };

  const handleMouseLeave = (e) => {
    setHover(false);
  };

  return (
    <div className={Style.getStyleClassName(cStyle)} onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Typography style = {textStyle} type = 'caption'>{title}</Typography>
      {onDelete ? <div style = {{ display: 'flex', marginLeft: '5px' }}><CancelIcon style = {{ fontSize: '20px' }} /></div> : ''}
    </div>
  );
};

export default Chip;
