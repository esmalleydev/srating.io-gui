'use client';

import React from 'react';

import BackButton from '@/components/generic/BackButton';

import Search from './Search';
import AdditionalOptions from '../AdditionalOptions';
import { Style } from '@esmalley/ts-utils';
import { useTheme, useWindowDimensions } from '@esmalley/react-material-ui';


// todo make mobile friendly

const getBreakPoint = () => {
  return 450;
};

const getHeaderHeight = () => {
  const { width } = useWindowDimensions();

  if (width <= getBreakPoint()) {
    return 110;
  }

  return 120;
};

const getMarginTop = () => {
  const { width } = useWindowDimensions();

  let margin = 64;

  if (width < 600) {
    margin = 56;
  }

  return margin;
};

export { getHeaderHeight, getMarginTop, getBreakPoint };

const ClientWrapper = ({ children }) => {
  const theme = useTheme();

  const titleStyle: React.CSSProperties = {
    paddingTop: 5,
    height: getHeaderHeight(),
    position: 'fixed',
    left: 0,
    right: 0,
    top: getMarginTop(),
    backgroundColor: theme.background.main,
    zIndex: 1100,
  };


  return (
    <>
      <div className = {Style.getStyleClassName(titleStyle)}>
        <div style = {{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <div style = {{ width: 50, display: 'flex', alignItems: 'baseline' }}>
            <BackButton />
          </div>
          <div style={{ width: '100%', maxWidth: 500 }}><Search /></div>
          <div style = {{ display: 'flex', justifyContent: 'end', position: 'relative', alignItems: 'baseline', width: 50 }}>
            {<AdditionalOptions />}
          </div>
        </div>
        <div>{children}</div>
      </div>
    </>
  );
};

export default ClientWrapper;
