'use client';

import React from 'react';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';
import { useTheme } from '@mui/material/styles';
// import AdditionalOptions from '@/components/generic/CBB/Team/AdditionalOptions';
import BackButton from '@/components/generic/BackButton';


const getBreakPoint = () => {
  return 450;
};

const getHeaderHeight = () => {
  // const { width } = useWindowDimensions() as Dimensions;

  // if (width <= breakPoint) {
  //   return 110;
  // }

  return 75;
};

const getMarginTop = () => {
  const { width } = useWindowDimensions() as Dimensions;

  let margin = 64;

  if (width < 600) {
    margin = 56;
  }

  return margin;
};

export { getBreakPoint, getHeaderHeight, getMarginTop };

const ClientWrapper = ({ children }) => {
  const theme = useTheme();

  const titleStyle: React.CSSProperties = {
    paddingTop: 5,
    height: getHeaderHeight(),
    position: 'sticky',
    top: getMarginTop(),
    backgroundColor: theme.palette.background.default,
    zIndex: 1100,
  };

  return (
    <>
      <div style = {titleStyle}>
        <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
          <div style = {{ display: 'flex', alignItems: 'baseline' }}>
            <BackButton />
          </div>
          {children}
          <div style = {{ display: 'flex', justifyContent: 'end', position: 'relative', alignItems: 'baseline' }}>
            <div style = {{ width: 36 }}></div>
            {/* <AdditionalOptions /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientWrapper;
