'use client';

import { useState } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import IconButton from '@mui/material/IconButton';

import { Tooltip } from '@mui/material';
// import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/team-slice';
import MenuItem from '@/components/ux/menu/MenuItem';
import Menu from '@/components/ux/menu/Menu';
import MenuList from '@/components/ux/menu/MenuList';
import MenuListIcon from '@/components/ux/menu/MenuListIcon';
import MenuListText from '@/components/ux/menu/MenuListText';

const AdditionalOptions = () => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const dispatch = useAppDispatch();
  const scheduleView = useAppSelector((state) => state.teamReducer.scheduleView);

  const handleView = (nextView: string) => {
    dispatch(setDataKey({ key: 'scheduleView', value: nextView }));
    dispatch(setDataKey({ key: 'scrollTop', value: 0 }));
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
         <MenuListIcon>
           {scheduleView === 'default' ? <CheckIcon fontSize='small' /> : <ViewModuleIcon fontSize='small' />}
         </MenuListIcon>
        <MenuListText primary = 'View card mode' />
      </MenuItem>,
    );

    menuItems.push(
      <MenuItem key='schedule-display-table' onClick={() => {
        handleView('table');
      }}>
         <MenuListIcon>
           {scheduleView === 'table' ? <CheckIcon fontSize='small' /> : <CalendarViewMonthIcon fontSize='small' />}
         </MenuListIcon>
        <MenuListText primary = 'View table mode' />
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
