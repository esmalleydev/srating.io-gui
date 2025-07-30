'use client';

import { useTheme } from '@/components/hooks/useTheme';
// import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import Color from '@/components/utils/Color';
import Style from '@/components/utils/Style';
import { RefObject } from 'react';

const Button = (
  {
    title,
    value,
    handleClick,
    ink = false,
    containerStyle = {},
    buttonStyle = {},
    ref = null,
  }:
  {
    title: string;
    value: string|number;
    handleClick: (e: React.SyntheticEvent, value: string | number) => void;
    ink?: boolean;
    containerStyle?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
    ref?: RefObject<HTMLDivElement> | null;
  },
) => {
  const theme = useTheme();
  // const { width } = useWindowDimensions() as Dimensions;

  const cStyle: React.CSSProperties = {
    display: 'inline-flex',
    // alignItems: 'center',
    // position: 'relative',
    // margin: 0,
    // cursor: 'pointer',
    // border: 'none',
    ...containerStyle,
  };


  const backgroundColor = cStyle.backgroundColor || theme.background.main;
  const textColor = theme.text.primary;

  const bStyle: React.CSSProperties = {
  //   width: '50%',
    // minWidth: width <= 425 ? 50 : 100,
    minWidth: 100,
    // padding: '0px 8px',
    height: 40,
    backgroundColor: 'transparent',
    color: Color.getTextColor(textColor, backgroundColor),
    textAlign: 'center',
    display: 'flex',
    // fontWeight: 500,
    // fontStyle: 'italic',
    // textTransform: 'uppercase',
    // alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: 'none',
    ...buttonStyle,
  };

  return (
    <div ref = {ref} className = {Style.getStyleClassName(cStyle)} onClick={(e) => { handleClick(e, value); }}>
      <button className = {Style.getStyleClassName(bStyle)}>
        {title}
      </button>
    </div>
  );
};

export default Button;
