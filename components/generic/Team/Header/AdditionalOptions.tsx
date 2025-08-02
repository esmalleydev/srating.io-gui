import { useState } from 'react';

import TripleDotsIcon from '@mui/icons-material/MoreVert';

import IconButton from '@mui/material/IconButton';

import RankPicker from '@/components/generic/RankPicker';
import Menu from '@/components/ux/menu/Menu';
import MenuList from '@/components/ux/menu/MenuList';
import MenuItem from '@/components/ux/menu/MenuItem';
import MenuListText from '@/components/ux/menu/MenuListText';

const AdditionalOptions = () => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const [rankPickerOpen, setRankPickerOpen] = useState(false);


  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
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
          </MenuList>
        </Menu>
        <RankPicker open = {rankPickerOpen} openHandler = {() => { setRankPickerOpen(true); }} closeHandler = {() => { setRankPickerOpen(false); }} />
    </div>
  );
};

export default AdditionalOptions;
