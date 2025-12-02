import { useState } from 'react';

import TripleDotsIcon from '@mui/icons-material/MoreVert';

import RankPicker from '@/components/generic/RankPicker';
import Menu from '@/components/ux/menu/Menu';
import MenuList from '@/components/ux/menu/MenuList';
import MenuItem from '@/components/ux/menu/MenuItem';
import MenuListText from '@/components/ux/menu/MenuListText';
import IconButton from '@/components/ux/buttons/IconButton';

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
        </MenuList>
      </Menu>
      <RankPicker open = {rankPickerOpen} openHandler = {() => { setRankPickerOpen(true); }} closeHandler = {() => { setRankPickerOpen(false); }} />
    </div>
  );
};

export default AdditionalOptions;
