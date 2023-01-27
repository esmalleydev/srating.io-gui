import React, { useState } from 'react';

import TripleDotsIcon from '@mui/icons-material/MoreVert';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import RankPicker from '../../../component/CBB/RankPicker';

const AdditionalOptions = (props) => {

  const rankDisplay = props.rankDisplay;


  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const [rankPickerOpen, setRankPickerOpen] = useState(false);

  const handleRankDisplay = (value) => {
    props.rankDisplayHandler(value);
    setRankPickerOpen(false);
  };

  const handleAnchor = (event) => {
    if (event) {
      setAnchor(event.currentTarget);
    } else {
      setAnchor(null);
    }
  };


  return (
    <div>
      <IconButton
          id="additional-options"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleAnchor}
        >
          <TripleDotsIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchor}
          open={open}
          onClose={handleAnchor}
        >
          <MenuItem key='rank-display' onClick={() => {
            setRankPickerOpen(true);
            handleAnchor();
          }}>
            Rank display
          </MenuItem>
        </Menu>
        <RankPicker open = {rankPickerOpen} selected = {rankDisplay} openHandler = {() => {setRankPickerOpen(true);}} closeHandler = {() => {setRankPickerOpen(false);}} actionHandler = {handleRankDisplay} />
    </div>
  );
}

export default AdditionalOptions;