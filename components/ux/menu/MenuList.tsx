'use client';

import { Style } from '@esmalley/ts-utils';


const MenuList = (
  {
    style = {},
    children,
  }:
  {
    style?: React.CSSProperties;
    children: React.ReactNode;
  },
) => {
  // const theme = useTheme();
  const ulStyle: React.CSSProperties = {
    listStyle: 'none',
    margin: 0,
    padding: '8px 0px',
    position: 'relative',
    ...style,
  };


  return (
    <ul className={`${Style.getStyleClassName(ulStyle)}`} tabIndex={-1}>
      {children}
    </ul>
  );
};

export default MenuList;
