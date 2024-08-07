import React, { useState } from 'react';
// import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';


import { Button, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@mui/material';
// import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateOrganizationID } from '@/redux/features/organization-slice';

const OrganizationPicker = () => {
  const dispatch = useAppDispatch();
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const selected = useAppSelector((state) => state.organizationReducer.organization_id);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  type Options = {
    value: string;
    label: string;
  }
  const statusOptions: Options[] = [];

  for (let organization_id in organizations) {
    statusOptions.push({
      'value': organization_id,
      'label': organizations[organization_id].code + ' (' + organizations[organization_id].name + ')',
    });
  }


  const handleOrganization = (value) => {
    handleClose();
    dispatch(updateOrganizationID(value));
  };

  const title = organizations[selected].code;

  return (
    <div>
      <Button
        id="organization-picker-button"
        aria-controls={open ? 'organization-picker-menu' : undefined}
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
        id="organization-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
          <MenuList>
            {statusOptions.map((statusOption, index) => {
              const isSelected = selected.indexOf(statusOption.value) > -1;
              return (
                <MenuItem key = {index} onClick = {() => handleOrganization(statusOption.value)}>
                  <ListItemIcon>
                    {isSelected ? <CheckCircleIcon color = 'success' fontSize='small' /> : <RadioButtonUncheckedIcon color = 'primary' fontSize='small' />}
                  </ListItemIcon>
                  <ListItemText>{statusOption.label}</ListItemText>
                </MenuItem>
              );
            })}
          </MenuList>
      </Menu>
    </div>
  );
};

export default OrganizationPicker;
