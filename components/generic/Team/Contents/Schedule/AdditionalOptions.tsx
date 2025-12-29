'use client';

import { useState } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

// import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/team-slice';
import Menu, { MenuOption } from '@/components/ux/menu/Menu';
import Tooltip from '@/components/ux/hover/Tooltip';
import IconButton from '@/components/ux/buttons/IconButton';

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

  const menuOptions: MenuOption[] = [
    {
      value: 'default',
      label: 'View card mode',
      selectable: true,
      onSelect: handleView,
      icon: scheduleView === 'default' ? <CheckIcon fontSize='small' /> : <ViewModuleIcon fontSize='small' />
    },
    {
      value: 'table',
      label: 'View table mode',
      selectable: true,
      onSelect: handleView,
      icon: scheduleView === 'table' ? <CheckIcon fontSize='small' /> : <CalendarViewMonthIcon fontSize='small' />
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
    </div>
  );
};

export default AdditionalOptions;
