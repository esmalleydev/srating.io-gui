import React, { useState } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import RankPicker from '@/components/generic/RankPicker';
import { Divider, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCardView, setOdds } from '@/redux/features/display-slice';

const AdditionalOptions = () => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const [rankPickerOpen, setRankPickerOpen] = useState(false);

  const dispatch = useAppDispatch();
  const hideOdds = useAppSelector((state) => state.displayReducer.hideOdds);
  const cardsView = useAppSelector((state) => state.displayReducer.cardsView);


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
        <ListItemText>Rank display</ListItemText>
      </MenuItem>,
    );

    menuItems.push(<Divider key = {'menu-divider'} />);

    menuItems.push(
      <MenuItem key='odds-display' onClick={() => {
        dispatch(setOdds(hideOdds === 1 ? 0 : 1));
      }}>
         <ListItemIcon>
           {hideOdds ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />}
         </ListItemIcon>
        <ListItemText>Hide odds</ListItemText>
      </MenuItem>,
    );

    menuItems.push(
      <MenuItem key='card-display' onClick={() => {
        dispatch(setCardView(cardsView === 'large' ? 'compact' : 'large'));
      }}>
         <ListItemIcon>
           {cardsView === 'large' ? <CheckIcon fontSize='small' /> : <ViewModuleIcon fontSize='small' />}
         </ListItemIcon>
        <ListItemText>View card mode</ListItemText>
      </MenuItem>,
    );

    return menuItems;
  };


  return (
    <div>
      <Tooltip title = {'Additional options'}>
        <IconButton
            id="additional-options"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleOpen}
          >
            <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="long-menu"
        anchorEl={anchor}
        open={open}
        onClose={handleClose}
      >
        {getMenuItems()}
      </Menu>
      <RankPicker open = {rankPickerOpen} openHandler = {() => { setRankPickerOpen(true); }} closeHandler = {() => { setRankPickerOpen(false); }} />
    </div>
  );
};

export default AdditionalOptions;
