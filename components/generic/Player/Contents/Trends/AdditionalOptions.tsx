'use client';

import { useState } from 'react';

// import TripleDotsIcon from '@esmalley/react-material-icons/MoreVert';
import SettingsIcon from '@esmalley/react-material-icons/Settings';
import CheckIcon from '@esmalley/react-material-icons/Check';
import VisibilityIcon from '@esmalley/react-material-icons/Visibility';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/player-slice';
import Menu, { MenuOption } from '@/components/ux/menu/Menu';
import Tooltip from '@/components/ux/hover/Tooltip';
import IconButton from '@/components/ux/buttons/IconButton';
import { useNavigation } from '@/components/hooks/useNavigation';

const AdditionalOptions = () => {
  const navigation = useNavigation();
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

  const menuOptions: MenuOption[] = [
    {
      value: 'show-boxscore-line',
      label: 'Show boxscore data',
      selectable: true,
      onSelect: handleTrendsBoxscore,
      icon: trendsBoxscoreLine ? <CheckIcon style = {{ fontSize: 20 }} /> : <VisibilityIcon style = {{ fontSize: 20 }} />,
    },
    {
      value: 'show-all-seasons',
      label: 'Show all seasons',
      selectable: true,
      onSelect: handleTrendsSeasons,
      icon: trendsSeasons.length ? <CheckIcon style = {{ fontSize: 20 }} /> : <VisibilityIcon style = {{ fontSize: 20 }} />,
    },
  ];

  return (
    <div>
      <Tooltip onClickRemove text = {'Additional filters'}>
        <IconButton
          value="additional-filters"
          onClick={handleOpen}
          icon = {<SettingsIcon style = {{ fontSize: 24 }} />}
        />
      </Tooltip>
      <Menu
        anchor={anchor}
        open={open}
        onClose={handleClose}
        options = {menuOptions}
      />
    </div>
  );
};

export default AdditionalOptions;
