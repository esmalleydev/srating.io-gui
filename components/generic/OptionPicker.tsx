'use client';

import { useState } from 'react';

import { Button, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

type optionType = {
  value: string;
  label: string;
};

const OptionPicker = (
  {
    selected,
    options,
    buttonName,
    actionHandler,
    autoClose = true,
    isRadio = false,
  }:
  {
    selected: string,
    options: Array<optionType>,
    buttonName: string,
    actionHandler?: (value: string) => void,
    autoClose?: boolean,
    isRadio?: boolean,
  },
) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (value: string) => {
    if (actionHandler) {
      actionHandler(value);
    }

    if (autoClose) {
      handleClose();
    }
  };

  const uncheckedIcon = (
    isRadio ?
    <RadioButtonUncheckedIcon color = 'primary' fontSize='small' /> :
    <CheckBoxOutlineBlankIcon color = 'primary' fontSize='small' />
  );

  return (
    <div>
      <Button
        id="option-picker-button"
        aria-controls={open ? 'option-picker-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="text"
        disableElevation
        onClick={handleOpen}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {buttonName}
      </Button>
      <Menu
        id="option-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
          <MenuList>
            {options.map((option, index) => {
              const isSelected = selected.indexOf(option.value) > -1;
              return (
                <MenuItem key = {index} onClick = {() => handleAction(option.value)}>
                  <ListItemIcon>
                    {
                      isSelected ?
                      <CheckIcon color = 'success' fontSize='small' /> :
                        uncheckedIcon
                    }
                  </ListItemIcon>
                  <ListItemText>{option.label}</ListItemText>
                </MenuItem>
              );
            })}
          </MenuList>
      </Menu>
    </div>
  );
};

export default OptionPicker;
