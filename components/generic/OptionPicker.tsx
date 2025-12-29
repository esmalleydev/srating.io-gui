'use client';

import { useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Menu, { MenuOption } from '@/components/ux/menu/Menu';
import Button from '@/components/ux/buttons/Button';
import { useTheme } from '../hooks/useTheme';

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
    showMenuCloseButton = false,
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
    showMenuCloseButton?: boolean,
  },
) => {
  // console.time('OptionPicker')
  const theme = useTheme();
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
    <RadioButtonUncheckedIcon style = {{ color: theme.primary.main }} fontSize='small' /> :
    <CheckBoxOutlineBlankIcon style = {{ color: theme.primary.main }} fontSize='small' />
  );

  // convert to MenuOption
  const menuOptions: MenuOption[] = options.map((option) => {
    const isSelected = selected.includes(option.value);
    return {
      value: option.value,
      label: option.label,
      secondaryLabel: option.sublabel,
      selectable: true,
      disabled: option.disabled,
      onSelect: handleAction,
      icon: isSelected ? <CheckIcon style = {{ color: theme.success.main }} fontSize='small' /> :  uncheckedIcon,
    };
  });

  return (
    <div>
      {
        renderButton ?
          renderButton(handleOpen, open) :
        <Button
          type = 'select'
          ink
          handleClick={handleOpen}
          title = {buttonName || 'Loading'}
          value = {buttonName || 'loading'}
        />
      }
      <Menu
        anchor={anchorEl}
        open={open}
        onClose={handleClose}
        showCloseButton = {showMenuCloseButton}
        options={menuOptions}
      />
    </div>
  );
};

export default OptionPicker;
