'use client';

import { Style } from '@esmalley/ts-utils';


const MenuListIcon = (
  {
    style = {},
    children,
  }:
  {
    style?: React.CSSProperties;
    children: React.ReactNode;
  },
) => {
  const cStyle: React.CSSProperties = {
    display: 'inline-flex',
    flexShrink: 0,
    paddingRight: '16px',
    ...style,
  };


  return (
    <div className={Style.getStyleClassName(cStyle)}>
      {children}
    </div>
  );
};

export default MenuListIcon;
