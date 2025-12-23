'use client';

import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import Objector from '@/components/utils/Objector';
import Style from '@/components/utils/Style';


const Columns = (
  {
    numberOfColumns = 2,
    breakPoint = 475,
    style = {},
    children,
  }:
  {
    numberOfColumns?: number;
    breakPoint?: number;
    style?: React.CSSProperties;
    children: React.ReactNode;
  },
) => {
  const { width } = useWindowDimensions() as Dimensions;

  const mobileStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
    width: '100%',
  };

  const standardStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
    gap: '10px',
    width: '100%',
  };

  const columnStyle = Objector.extender(
    (width <= breakPoint ? mobileStyle : standardStyle),
    style,
  );


  return (
    <div className = {Style.getStyleClassName(columnStyle)}>
      {children}
    </div>
  );
};

export default Columns;
