'use client';
import React from 'react';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { useTheme, IconButton, Tooltip } from '@mui/material';
import { getBreakPoint } from '@/components/generic/CBB/Games/NavBar';
import ConferencePicker from '@/components/generic/CBB/ConferencePicker';
import AdditionalOptions from '@/components/generic/CBB/Games/AdditionalOptions';
import StatusPicker from '@/components/generic/CBB/StatusPicker';

import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCardView } from '@/redux/features/display-slice';

const getHeaderHeight = () => {
  return 48;
};


export { getHeaderHeight };

const SubNavBar = () => {
  const theme = useTheme();
  const { width }= useWindowDimensions() as Dimensions;

  const dispatch = useAppDispatch();
  const cardsView = useAppSelector(state => state.displayReducer.value.cardsView);


  const handleView = (nextView: string) => {
    dispatch(setCardView(nextView));
  };


  const subHeaderHeight = getHeaderHeight();
  let subHeaderTop = 112;
  let minSubBarWidth = 75;

  if (width < getBreakPoint()) {
    minSubBarWidth = 0;
    subHeaderTop = 104;
  }


  const subHeaderStyle: React.CSSProperties = {
    'height': subHeaderHeight,
    'position': 'fixed',
    'backgroundColor': theme.palette.background.default,
    'zIndex': 1100,
    'display': 'flex',
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'top': subHeaderTop,
    'left': 0,
    'right': 0,
  };


  return (
    <div style = {subHeaderStyle}>
      <div style = {{'minWidth': minSubBarWidth, 'display': 'flex'}}>
        <ConferencePicker />
        <StatusPicker />
      </div>

      <div style = {{'minWidth': minSubBarWidth, 'display': 'flex'}}>
        <Tooltip title = {'View compact mode'}>
          <IconButton
            id = 'compact-button'
            onClick = {() => handleView('compact')}
          >
            <ViewListIcon color = {cardsView === 'compact' ? 'success' : 'primary'} />
          </IconButton>
        </Tooltip>
        <Tooltip title = {'View card mode'}>
          <IconButton
            id = 'large-card-button'
            onClick = {() => handleView('large')}
          >
            <ViewModuleIcon color = {cardsView === 'large' ? 'success' : 'primary'} />
          </IconButton>
        </Tooltip>
        <AdditionalOptions />
      </div>
    </div>
  );
};

export default SubNavBar;