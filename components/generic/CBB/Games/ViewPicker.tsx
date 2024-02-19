'use client';
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCardView } from '@/redux/features/display-slice';
import { useScrollContext } from '@/contexts/scrollContext';
import { setScrollTop } from '@/redux/features/games-slice';

// todo when changing view, do not scroll to the top

const ViewPicker = () => {
  const dispatch = useAppDispatch();
  const cardsView = useAppSelector(state => state.displayReducer.cardsView);

  const scrollRef  = useScrollContext();

  const handleView = (nextView: string) => {
    dispatch(setCardView(nextView));
    if (
      scrollRef &&
      scrollRef.current
      ) {
      dispatch(setScrollTop(scrollRef.current.scrollTop));
    }
  };


  return (
    <>
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
    </>
  );
};

export default ViewPicker;