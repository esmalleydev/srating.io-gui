'use client';

import { useState } from 'react';

import { IconButton } from '@mui/material';
import TripleDotsIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setHideLowerBench } from '@/redux/features/compare-slice';
import Menu from '@/components/ux/menu/Menu';
import MenuList from '@/components/ux/menu/MenuList';
import MenuItem from '@/components/ux/menu/MenuItem';
import MenuListIcon from '@/components/ux/menu/MenuListIcon';
import MenuListText from '@/components/ux/menu/MenuListText';

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
          anchor={anchor}
          open={open}
          onClose={handleClose}
        >
          <MenuList>
            <MenuItem key='hide-lower-bench-display' onClick={() => {
              dispatch(setHideLowerBench(!hideLowerBench));
              handleClose();
            }}>
              <MenuListIcon>
                {hideLowerBench ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />}
              </MenuListIcon>
              <MenuListText primary='Hide under 3 MPG' />
            </MenuItem>
          </MenuList>
        </Menu>
    </div>
  );
};

export default PlayerAdditionalOptions;
