import React, { useState } from 'react';

import TripleDotsIcon from '@mui/icons-material/MoreVert';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import RankPicker from '../RankPicker';
import SortPicker from '../SortPicker';

const AdditionalOptions = (props) => {

  const rankDisplay = props.rankDisplay;
  const sortOrder = props.sortOrder;

  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const [rankPickerOpen, setRankPickerOpen] = useState(false);
  const [sortPickerOpen, setSortPickerOpen] = useState(false);

  const handleRankDisplay = (value) => {
    props.rankDisplayHandler(value);
    setRankPickerOpen(false);
  };

  const handleSortOrder = (value) => {
    props.sortHandler(value);
    setSortPickerOpen(false);
  };

  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchor(null);
  };


  return (
    <div>
      <IconButton
          id="additional-options"
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
          <MenuItem key='rank-display' onClick={() => {
            setRankPickerOpen(true);
            handleClose();
          }}>
            Rank display
          </MenuItem>
          <MenuItem key='sort-display' onClick={() => {
            setSortPickerOpen(true);
            handleClose();
          }}>
            Sort order
          </MenuItem>
        </Menu>
        <SortPicker open = {sortPickerOpen} selected = {sortOrder} openHandler = {() => {setSortPickerOpen(true);}} closeHandler = {() => {setSortPickerOpen(false);}} actionHandler = {handleSortOrder} />
        <RankPicker open = {rankPickerOpen} selected = {rankDisplay} openHandler = {() => {setRankPickerOpen(true);}} closeHandler = {() => {setRankPickerOpen(false);}} actionHandler = {handleRankDisplay} />
    </div>
  );
}

export default AdditionalOptions;