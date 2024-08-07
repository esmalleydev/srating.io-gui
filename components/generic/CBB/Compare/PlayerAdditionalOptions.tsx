'use client';

import React, { useState } from 'react';

import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import TripleDotsIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setHideLowerBench } from '@/redux/features/compare-slice';

const PlayerAdditionalOptions = () => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const dispatch = useAppDispatch();
  const hideLowerBench = useAppSelector((state) => state.compareReducer.hideLowerBench);


  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  return (
    <div>
      <IconButton
          id="player-additional-options"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          <TripleDotsIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchor}
          open={open}
          onClose={handleClose}
        >
          <MenuItem key='hide-lower-bench-display' onClick={() => {
            dispatch(setHideLowerBench(!hideLowerBench));
            handleClose();
          }}>
            <ListItemIcon>
              {hideLowerBench ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />}
            </ListItemIcon>
            <ListItemText>Hide under 3 MPG</ListItemText>
          </MenuItem>
        </Menu>
    </div>
  );
};

export default PlayerAdditionalOptions;
