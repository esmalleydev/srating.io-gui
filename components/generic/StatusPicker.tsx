'use client';

import { useState } from 'react';
// import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';


import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Menu from '@/components/ux/menu/Menu';
import MenuList from '@/components/ux/menu/MenuList';
import MenuItem from '@/components/ux/menu/MenuItem';
import MenuListIcon from '@/components/ux/menu/MenuListIcon';
import MenuListText from '@/components/ux/menu/MenuListText';
import { setDataKey } from '@/redux/features/display-slice';

const StatusPicker = () => {
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

  const code_x_label = {
    pre: 'Upcoming',
    live: 'Live',
    final: 'Final',
  };

  const statusOptions = [{ value: 'pre', label: 'Upcoming' }, { value: 'live', label: 'Live' }, { value: 'final', label: 'Final' }];

  const handleStatuses = (value: string) => {
    dispatch(setDataKey({ key: 'statuses', value }));
  };

  let title = 'Status';

  if (statuses.length === 1) {
    title = `${code_x_label[statuses[0]]} only`;
  } else if (statuses.length === 2) {
    title = `${code_x_label[statuses[0]]} & ${code_x_label[statuses[1]]}`;
  }

  return (
    <div>
      <Button
        id="status-picker-button"
        aria-controls={open ? 'status-picker-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="text"
        disableElevation
        onClick={handleOpen}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {title}
      </Button>
      <Menu
        anchor={anchorEl}
        open={open}
        onClose={handleClose}
      >
          <MenuList>
            {statusOptions.map((statusOption, index) => {
              const isSelected = selected.indexOf(statusOption.value) > -1;
              return (
                <MenuItem key = {index} onClick = {() => handleStatuses(statusOption.value)}>
                  <MenuListIcon>
                    {isSelected ? <CheckIcon color = 'success' fontSize='small' /> : <CheckBoxOutlineBlankIcon color = 'primary' fontSize='small' />}
                  </MenuListIcon>
                  <MenuListText primary={statusOption.label} />
                </MenuItem>
              );
            })}
          </MenuList>
      </Menu>
    </div>
  );
};

export default StatusPicker;
