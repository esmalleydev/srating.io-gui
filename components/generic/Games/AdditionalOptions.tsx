'use client';

import { useState } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';


import RankPicker from '@/components/generic/RankPicker';
import { Divider } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Menu from '@/components/ux/menu/Menu';
import MenuItem from '@/components/ux/menu/MenuItem';
import MenuList from '@/components/ux/menu/MenuList';
import MenuListIcon from '@/components/ux/menu/MenuListIcon';
import MenuListText from '@/components/ux/menu/MenuListText';
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

  const getMenuItems = () => {
    const menuItems: React.JSX.Element[] = [];

    menuItems.push(
      <MenuItem key='rank-display' onClick={() => {
        setRankPickerOpen(true);
        handleClose();
      }}>
        <MenuListIcon>
          <MilitaryTechIcon fontSize='small' />
        </MenuListIcon>
        <MenuListText primary='Rank display' />
      </MenuItem>,
    );

    menuItems.push(
      <MenuItem key='card-display' onClick={() => {
        setCardPickerOpen(true);
        handleClose();
      }}>
        <MenuListIcon>
          <ViewModuleIcon fontSize='small' />
        </MenuListIcon>
        <MenuListText primary='Card display' />
      </MenuItem>,
    );

    menuItems.push(<Divider key = {'menu-divider'} />);

    menuItems.push(
      <MenuItem key='odds-display' onClick={() => {
        dispatch(setDataKey({ key: 'hideOdds', value: (hideOdds === 1 ? 0 : 1) }));
      }}>
         <MenuListIcon>
           {hideOdds ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />}
         </MenuListIcon>
         <MenuListText primary='Hide odds' />
      </MenuItem>,
    );

    return menuItems;
  };


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
      >
        <MenuList>
          {getMenuItems()}
        </MenuList>
      </Menu>
      <RankPicker open = {rankPickerOpen} openHandler = {() => { setRankPickerOpen(true); }} closeHandler = {() => { setRankPickerOpen(false); }} />
      <CardPicker open = {cardPickerOpen} openHandler = {() => { setCardPickerOpen(true); }} closeHandler = {() => { setCardPickerOpen(false); }} />
    </div>
  );
};

export default AdditionalOptions;
