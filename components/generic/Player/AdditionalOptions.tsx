import { useState } from 'react';

import Settings from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';


import Menu, { MenuOption } from '@/components/ux/menu/Menu';
import IconButton from '@/components/ux/buttons/IconButton';
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

  const menuOptions: MenuOption[] = [
    {
      value: 'show_per_game_stats',
      label: 'Show per game stats',
      selectable: true,
      onSelect: handlePerGameToggle,
      icon: showPerGameStats ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />
    },
  ];


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
        options={menuOptions}
      />
    </div>
  );
};

export default AdditionalOptions;
