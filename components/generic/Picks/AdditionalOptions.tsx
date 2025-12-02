import React, { useState } from 'react';

import TripleDotsIcon from '@mui/icons-material/MoreVert';


import RankPicker from '@/components/generic/RankPicker';
import SortPicker from '@/components/generic/CBB/SortPicker';
import Menu from '@/components/ux/menu/Menu';
import MenuItem from '@/components/ux/menu/MenuItem';
import MenuListText from '@/components/ux/menu/MenuListText';
import IconButton from '@/components/ux/buttons/IconButton';
import MenuList from '@/components/ux/menu/MenuList';

const AdditionalOptions = () => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const [rankPickerOpen, setRankPickerOpen] = useState(false);
  const [sortPickerOpen, setSortPickerOpen] = useState(false);


  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };


  return (
    <div>
      <IconButton
        value="additional-options"
        onClick={handleOpen}
        icon = {<TripleDotsIcon />}
      />
      <Menu
        anchor={anchor}
        open={open}
        onClose={handleClose}
      >
        <MenuList>
          <MenuItem key='rank-display' onClick={() => {
            setRankPickerOpen(true);
            handleClose();
          }}>
            <MenuListText primary='Rank display' />
          </MenuItem>
          <MenuItem key='sort-display' onClick={() => {
            setSortPickerOpen(true);
            handleClose();
          }}>
            <MenuListText primary='Sort order' />
          </MenuItem>
        </MenuList>
      </Menu>
      <SortPicker open = {sortPickerOpen} openHandler = {() => { setSortPickerOpen(true); }} closeHandler = {() => { setSortPickerOpen(false); }} />
      <RankPicker open = {rankPickerOpen} openHandler = {() => { setRankPickerOpen(true); }} closeHandler = {() => { setRankPickerOpen(false); }} />
    </div>
  );
};

export default AdditionalOptions;
