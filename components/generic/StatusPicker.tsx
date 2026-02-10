'use client';

import { useState } from 'react';
// import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';


import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Menu, { MenuOption } from '@/components/ux/menu/Menu';
import { updateDataKey } from '@/redux/features/display-slice';
import Button from '@/components/ux/buttons/Button';
import { useTheme } from '../hooks/useTheme';

const StatusPicker = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const statuses = useAppSelector((state) => state.displayReducer.statuses);
  // const { width } = useWindowDimensions() as Dimensions;

  const selected = statuses;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatuses = (value: string) => {
    dispatch(updateDataKey({ key: 'statuses', value }));
  };

  const code_x_label = {
    pre: 'Upcoming',
    live: 'Live',
    final: 'Final',
  };

  const statusOptions: MenuOption[] = [
    {
      value: 'pre',
      label: 'Upcoming',
      selectable: true,
      onSelect: handleStatuses,
      icon: selected.indexOf('pre') > -1 ? <CheckIcon style = {{ color: theme.success.main }} fontSize='small' /> : <CheckBoxOutlineBlankIcon style = {{ color: theme.primary.main }} fontSize='small' />
    },
    {
      value: 'live',
      label: 'Live',
      selectable: true,
      onSelect: handleStatuses,
      icon: selected.indexOf('live') > -1 ? <CheckIcon style = {{ color: theme.success.main }} fontSize='small' /> : <CheckBoxOutlineBlankIcon style = {{ color: theme.primary.main }} fontSize='small' />
    },
    {
      value: 'final',
      label: 'Final',
      selectable: true,
      onSelect: handleStatuses,
      icon: selected.indexOf('final') > -1 ? <CheckIcon style = {{ color: theme.success.main }} fontSize='small' /> : <CheckBoxOutlineBlankIcon style = {{ color: theme.primary.main }} fontSize='small' />
    }
  ];

  let title = 'Status';

  if (statuses.length === 1) {
    title = `${code_x_label[statuses[0]]} only`;
  } else if (statuses.length === 2) {
    title = `${code_x_label[statuses[0]]} & ${code_x_label[statuses[1]]}`;
  }

  return (
    <div>
      <Button
        type = 'select'
        ink
        handleClick={handleOpen}
        title = {title}
        value = {title}
      />
      <Menu
        anchor={anchorEl}
        open={open}
        onClose={handleClose}
        options={statusOptions}
      />
    </div>
  );
};

export default StatusPicker;
