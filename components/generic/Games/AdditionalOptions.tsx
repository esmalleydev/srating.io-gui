'use client';

import { useState } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';


import RankPicker from '@/components/generic/RankPicker';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Menu, { MenuDivider, MenuOption } from '@/components/ux/menu/Menu';
import Tooltip from '@/components/ux/hover/Tooltip';
import { setDataKey } from '@/redux/features/display-slice';
import CardPicker from './CardPicker';
import IconButton from '@/components/ux/buttons/IconButton';

const AdditionalOptions = () => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const [rankPickerOpen, setRankPickerOpen] = useState(false);
  const [cardPickerOpen, setCardPickerOpen] = useState(false);

  const dispatch = useAppDispatch();
  const hideOdds = useAppSelector((state) => state.displayReducer.hideOdds);


  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };


  const menuOptions: MenuOption[] = [
    {
      value: 'rank_display',
      label: 'Rank display',
      selectable: true,
      onSelect: () => {
        setRankPickerOpen(true);
        handleClose();
      },
      icon: <MilitaryTechIcon fontSize='small' />
    },
    {
      value: 'card_display',
      label: 'Card display',
      selectable: true,
      onSelect: () => {
        setCardPickerOpen(true);
        handleClose();
      },
      icon: <ViewModuleIcon fontSize='small' />
    },
    {
      value: null,
      selectable: false,
      customLabel: <MenuDivider />
    },
    {
      value: 'odds_display',
      label: 'Hide odds',
      selectable: true,
      onSelect: () => {
        dispatch(setDataKey({ key: 'hideOdds', value: (hideOdds === 1 ? 0 : 1) }));
      },
      icon: hideOdds ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />
    },
  ];


  return (
    <div>
      <Tooltip onClickRemove text = {'Additional options'}>
        <IconButton
          value="additional-options"
          onClick={handleOpen}
          icon = {<SettingsIcon />}
        />
      </Tooltip>
      <Menu
        anchor={anchor}
        open={open}
        onClose={handleClose}
        options = {menuOptions}
      />
      <RankPicker open = {rankPickerOpen} openHandler = {() => { setRankPickerOpen(true); }} closeHandler = {() => { setRankPickerOpen(false); }} />
      <CardPicker open = {cardPickerOpen} openHandler = {() => { setCardPickerOpen(true); }} closeHandler = {() => { setCardPickerOpen(false); }} />
    </div>
  );
};

export default AdditionalOptions;
