'use client';

import { useState } from 'react';

// import TripleDotsIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';

import IconButton from '@mui/material/IconButton';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/player-slice';
import Menu from '@/components/ux/menu/Menu';
import MenuList from '@/components/ux/menu/MenuList';
import MenuItem from '@/components/ux/menu/MenuItem';
import MenuListIcon from '@/components/ux/menu/MenuListIcon';
import MenuListText from '@/components/ux/menu/MenuListText';
import Tooltip from '@/components/ux/hover/Tooltip';
import Navigation from '@/components/helpers/Navigation';

const AdditionalOptions = () => {
  const navigation = new Navigation();
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const dispatch = useAppDispatch();
  const trendsBoxscoreLine = useAppSelector((state) => state.playerReducer.trendsBoxscoreLine);
  const trendsSeasons = useAppSelector((state) => state.playerReducer.trendsSeasons);
  const player_team_seasons = useAppSelector((state) => state.playerReducer.player_team_seasons);


  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const handleTrendsBoxscore = () => {
    const newValue: boolean = !trendsBoxscoreLine;
    dispatch(setDataKey({ key: 'trendsBoxscoreLine', value: newValue }));
    handleClose();
  };

  const handleTrendsSeasons = () => {
    const newValue: number[] = trendsSeasons.length ? [] : Object.values(player_team_seasons).map((r) => r.season);
    navigation.playerView({ trendsSeasons: newValue });
    handleClose();
  };

  const getMenuItems = () => {
    const menuItems: React.JSX.Element[] = [];

    menuItems.push(
      <MenuItem key='show-boxscore-line' onClick={() => {
        handleTrendsBoxscore();
      }}>
        <MenuListIcon>
          {trendsBoxscoreLine ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />}
        </MenuListIcon>
        <MenuListText primary='Show boxscore data' />
      </MenuItem>,
      <MenuItem key='show-all-seasons' onClick={() => {
        handleTrendsSeasons();
      }}>
        <MenuListIcon>
          {trendsSeasons.length ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />}
        </MenuListIcon>
        <MenuListText primary='Show all seasons' />
      </MenuItem>,
    );

    return menuItems;
  };


  return (
    <div>
      <Tooltip onClickRemove text = {'Additional filters'}>
        <IconButton
            id="additional-filters"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleOpen}
          >
            <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchor={anchor}
        open={open}
        onClose={handleClose}
      >
        <MenuList>
          {getMenuItems()}
        </MenuList>
      </Menu>
    </div>
  );
};

export default AdditionalOptions;
