'use client';

import { useState } from 'react';

import SettingsIcon from '@esmalley/react-material-icons/Settings';
import CheckIcon from '@esmalley/react-material-icons/Check';
// import VisibilityIcon from '@esmalley/react-material-icons/Visibility';
import ViewModuleIcon from '@esmalley/react-material-icons/ViewModule';

// import ViewListIcon from '@esmalley/react-material-icons/ViewList';
import CalendarViewMonthIcon from '@esmalley/react-material-icons/CalendarViewMonth';
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

  const handleView = (option: MenuOption) => {
    const nextView = option.value as string;
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
      icon: scheduleView === 'default' ? <CheckIcon style = {{ fontSize: 20 }} /> : <ViewModuleIcon style = {{ fontSize: 20 }} />,
    },
    {
      value: 'table',
      label: 'View table mode',
      selectable: true,
      onSelect: handleView,
      icon: scheduleView === 'table' ? <CheckIcon style = {{ fontSize: 20 }} /> : <CalendarViewMonthIcon style = {{ fontSize: 20 }} />,
    },
  ];

  return (
    <div>
      <Tooltip onClickRemove text = {'Additional options'}>
        <IconButton
          value="additional-options"
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
