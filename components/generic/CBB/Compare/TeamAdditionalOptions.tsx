'use client';
import React, { useState } from 'react';

import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import TripleDotsIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import LuggageIcon from '@mui/icons-material/Luggage';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setNeutralSite } from '@/redux/features/compare-slice';

const TeamAdditionalOptions = () => {

  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const dispatch = useAppDispatch();
  const neutral_site = useAppSelector(state => state.compareReducer.neutral_site);


  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  return (
    <div>
      <IconButton
          id="team-additional-options"
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
          <MenuItem key='neutral-site-display' onClick={() => {
            dispatch(setNeutralSite(+!neutral_site));
            handleClose();
          }}>
            <ListItemIcon>
              {neutral_site ? <CheckIcon fontSize='small' /> : <LuggageIcon fontSize='small' />}
            </ListItemIcon>
            <ListItemText>Neutral site game</ListItemText>
          </MenuItem>
        </Menu>
    </div>
  );
}

export default TeamAdditionalOptions;