'use client';

import { useState } from 'react';

import {
  Button,
  ListItemIcon,
  ListItemText,
  // Menu,
  MenuItem,
  MenuList,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Menu from '../ux/Menu';

export type optionType = {
  value: string | null;
  label: string;
  sublabel?: string;
  disabled?: boolean;
};

// export type CustomButtonProps = {
//   onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
// };

const OptionPicker = (
  {
    selected,
    options,
    buttonName,
    // CustomButton,
    renderButton,
    actionHandler,
    closeHandler,
    autoClose = true,
    isRadio = false,
  }:
  {
    selected: (string | null)[],
    options: Array<optionType>,
    buttonName?: string,
    renderButton?: (handleOpen: (e: React.MouseEvent<HTMLButtonElement>) => void, open: boolean) => React.ReactNode,
    // CustomButton?: React.ComponentType<CustomButtonProps>,
    actionHandler?: (value: string | null) => void,
    closeHandler?: () => void,
    autoClose?: boolean,
    isRadio?: boolean,
  },
) => {
  // console.time('OptionPicker')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // useEffect(() => {
  //   console.timeEnd('OptionPicker')
  // })

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    if (closeHandler) {
      closeHandler();
    }
    setAnchorEl(null);
  };

  const handleAction = (value: string | null) => {
    // console.time('OptionPicker.handleAction')
    if (actionHandler) {
      actionHandler(value);
    }

    if (autoClose) {
      handleClose();
    }
    // console.timeEnd('OptionPicker.handleAction')
  };

  const uncheckedIcon = (
    isRadio ?
    <RadioButtonUncheckedIcon color = 'primary' fontSize='small' /> :
    <CheckBoxOutlineBlankIcon color = 'primary' fontSize='small' />
  );

  return (
    <div>
      {
        renderButton ?
          renderButton(handleOpen, open) :
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
      }
      <Menu
        // id="option-menu"
        anchor={anchorEl}
        // anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
          <MenuList>
            {options.map((option, index) => {
              const isSelected = selected.includes(option.value);
              return (
                <MenuItem disabled = {option.disabled} key = {index} onClick = {() => handleAction(option.value)}>
                  <ListItemIcon>
                    {
                      isSelected ?
                      <CheckIcon color = 'success' fontSize='small' /> :
                        uncheckedIcon
                    }
                  </ListItemIcon>
                  {option.sublabel ? <ListItemText primary = {option.label} secondary = {option.sublabel} /> : <ListItemText>{option.label}</ListItemText>}
                </MenuItem>
              );
            })}
          </MenuList>
      </Menu>
    </div>
  );
};

export default OptionPicker;
