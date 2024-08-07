'use client';

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setScheduleView, setScrollTop } from '@/redux/features/team-slice';

const ViewPicker = ({ view }) => {
  const dispatch = useAppDispatch();

  const scheduleView = useAppSelector((state) => state.teamReducer.scheduleView);

  const handleView = (nextView: string) => {
    dispatch(setScheduleView(nextView));
    dispatch(setScrollTop(0));
  };

  return (
    <>
      <Tooltip title = {'View default mode'}>
        <IconButton
          id = 'default-button'
          onClick = {() => handleView('default')}
        >
          <ViewListIcon color = {scheduleView === 'default' ? 'success' : 'primary'} />
        </IconButton>
      </Tooltip>
      <Tooltip title = {'View table mode'}>
        <IconButton
          id = 'table-card-button'
          onClick = {() => handleView('table')}
        >
          <CalendarViewMonthIcon color = {scheduleView === 'table' ? 'success' : 'primary'} />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default ViewPicker;
