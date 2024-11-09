'use client';

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCardView } from '@/redux/features/display-slice';
import { useScrollContext } from '@/contexts/scrollContext';
import { setScrollTop } from '@/redux/features/games-slice';

const ViewPicker = () => {
  const dispatch = useAppDispatch();
  const cardsView = useAppSelector((state) => state.displayReducer.cardsView);

  const scrollRef = useScrollContext();

  const handleView = (nextView: string) => {
    dispatch(setCardView(nextView));

    // todo this seems to still scroll to the top
    if (
      scrollRef &&
      scrollRef.current
    ) {
      dispatch(setScrollTop(scrollRef.current.scrollTop));
    }
  };


  return (
    <>
      <Tooltip title = {cardsView === 'large' ? 'View compact mode' : 'View card mode'}>
        <IconButton
          id = 'view-card-mode-button'
          onClick = {() => handleView(cardsView === 'large' ? 'compact' : 'large')}
        >
          <ViewModuleIcon color = {cardsView === 'large' ? 'success' : 'primary'} />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default ViewPicker;
