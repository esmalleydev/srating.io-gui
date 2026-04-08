import { useState } from 'react';

import Settings from '@esmalley/react-material-icons/Settings';
import CheckIcon from '@esmalley/react-material-icons/Check';
import VisibilityIcon from '@esmalley/react-material-icons/Visibility';


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
      icon: showPerGameStats ? <CheckIcon style = {{ fontSize: 20 }} /> : <VisibilityIcon style = {{ fontSize: 20 }} />,
    },
  ];


  return (
    <div>
      <IconButton
        value="additional-options"
        onClick={handleOpen}
        icon = {<Settings style = {{ fontSize: 24 }} />}
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
