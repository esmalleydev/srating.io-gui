'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Fab, Tooltip } from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { setTableFullscreen } from '@/redux/features/ranking-slice';


const FloatingButtons = () => {
  const dispatch = useAppDispatch();
  const tableFullscreen = useAppSelector((state) => state.rankingReducer.tableFullscreen);

  const handleFullscreen = () => {
    dispatch(setTableFullscreen(!(tableFullscreen)));
  };


  return (
    <div style = {{ position: 'absolute', bottom: 70, right: 15 }}>
      <Tooltip disableFocusListener placement = 'top' title={`${tableFullscreen ? 'Minimize' : 'Full screen'} table`}>
        <Fab size = 'small' color = 'secondary' onClick={handleFullscreen}>
          {tableFullscreen ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
        </Fab>
      </Tooltip>
    </div>
  );
};

export default FloatingButtons;
