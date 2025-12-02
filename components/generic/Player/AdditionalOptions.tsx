import { useState } from 'react';

import Settings from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';


import Menu from '@/components/ux/menu/Menu';
import MenuItem from '@/components/ux/menu/MenuItem';
import MenuListText from '@/components/ux/menu/MenuListText';
import IconButton from '@/components/ux/buttons/IconButton';
import MenuList from '@/components/ux/menu/MenuList';
import MenuListIcon from '@/components/ux/menu/MenuListIcon';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/player-slice';

const AdditionalOptions = () => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const dispatch = useAppDispatch();
  const showPerGameStats = useAppSelector((state) => state.playerReducer.showPerGameStats);


  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const handlePerGameToggle = () => {
    dispatch(setDataKey({ key: 'showPerGameStats', value: !showPerGameStats }));
    handleClose();
  };


  return (
    <div>
      <IconButton
        value="additional-options"
        onClick={handleOpen}
        icon = {<Settings />}
      />
      <Menu
        anchor={anchor}
        open={open}
        onClose={handleClose}
      >
        <MenuList>
          <MenuItem key='show-per-game-stats' onClick={() => {
            handlePerGameToggle();
          }}>
            <MenuListIcon>
              {showPerGameStats ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />}
            </MenuListIcon>
            <MenuListText primary = {'Show per game stats'} />
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export default AdditionalOptions;
