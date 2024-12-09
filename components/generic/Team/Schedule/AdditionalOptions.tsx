'use client';

import { useState } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { ListItemIcon, ListItemText, Tooltip } from '@mui/material';
// import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setScheduleView, setScrollTop } from '@/redux/features/team-slice';

const AdditionalOptions = () => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const dispatch = useAppDispatch();
  const scheduleView = useAppSelector((state) => state.teamReducer.scheduleView);

  const handleView = (nextView: string) => {
    dispatch(setScheduleView(nextView));
    dispatch(setScrollTop(0));
  };


  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const getMenuItems = () => {
    const menuItems: React.JSX.Element[] = [];

    menuItems.push(
      <MenuItem key='schedule-display-default' onClick={() => {
        handleView('default');
      }}>
         <ListItemIcon>
           {scheduleView === 'default' ? <CheckIcon fontSize='small' /> : <ViewModuleIcon fontSize='small' />}
         </ListItemIcon>
        <ListItemText>View card mode</ListItemText>
      </MenuItem>,
    );

    menuItems.push(
      <MenuItem key='schedule-display-table' onClick={() => {
        handleView('table');
      }}>
         <ListItemIcon>
           {scheduleView === 'table' ? <CheckIcon fontSize='small' /> : <CalendarViewMonthIcon fontSize='small' />}
         </ListItemIcon>
        <ListItemText>View table mode</ListItemText>
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
    </div>
  );
};

export default AdditionalOptions;
