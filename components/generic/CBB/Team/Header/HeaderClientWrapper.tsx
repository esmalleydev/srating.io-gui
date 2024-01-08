'use client';
import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import { useTheme } from '@mui/material/styles';

import SeasonPicker from '@/components/generic/CBB/SeasonPicker';
import BackdropLoader from '@/components/generic/BackdropLoader';
import AdditionalOptions from '@/components/generic/CBB/Team/AdditionalOptions';
import BackButton from '@/components/generic/BackButton';


const breakPoint = 450;

const getHeaderHeight = () => {
  const { width } = useWindowDimensions() as Dimensions;

  if (width <= breakPoint) {
    return 110;
  }

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

export { getHeaderHeight, getMarginTop };

const HeaderClientWrapper = ({season, children}) => {
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const { width } = useWindowDimensions() as Dimensions;

  const [isPending, startTransition] = useTransition();

  const [spin, setSpin] = useState(false);


  const handleSeason = (season) => {
    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('season', season);
      const search = current.toString();
      const query = search ? `?${search}` : "";
      setSpin(true);
      startTransition(() => {
        router.push(`${pathName}${query}`);
        setSpin(false);
      });
    }
  }

  const titleStyle: React.CSSProperties = {
    'paddingTop': 5,
    'height': getHeaderHeight(),
    'position': 'sticky',
    'top': getMarginTop(),
    'backgroundColor': theme.palette.background.default,
    'zIndex': 1100,
  };


  const sideWidth = 115;

  return (
    <>
      <div style = {titleStyle}>
        <div style = {{'display': 'flex', 'justifyContent': 'space-between'}}>
          <div style = {{'width': sideWidth, 'display': 'flex', 'alignItems': 'baseline'}}>
            <BackButton />
          </div>
          {width > breakPoint ? children : ''}
          <div style = {{'display': 'flex', 'justifyContent': 'end', 'position': 'relative', 'alignItems': 'baseline', 'width': sideWidth, 'minWidth': sideWidth}}>
            <SeasonPicker selected = {season} actionHandler = {handleSeason} />
            <AdditionalOptions />
          </div>
        </div>
        {width <= breakPoint ? 
          <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
            {children}
          </div>
        : ''}
      </div>
      <BackdropLoader open = {(spin === true)} />
    </>
  );
}

export default HeaderClientWrapper;
