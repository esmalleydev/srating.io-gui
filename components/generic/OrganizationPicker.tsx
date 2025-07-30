'use client';

import { useState, useTransition } from 'react';
// import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';


import { Button, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, useTheme } from '@mui/material';
// import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateOrganizationID } from '@/redux/features/organization-slice';
import { clearLocalStorage, setLoading } from '@/redux/features/display-slice';
import { usePathname, useRouter } from 'next/navigation';
import { reset as resetGames } from '@/redux/features/games-slice';
import { reset as resetRanking } from '@/redux/features/ranking-slice';
import Organization from '@/components/helpers/Organization';

const OrganizationPicker = () => {
  const dispatch = useAppDispatch();
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const selected = useAppSelector((state) => state.organizationReducer.organization_id);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathName = usePathname();
  const theme = useTheme();

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

  for (const organization_id in organizations) {
    statusOptions.push({
      value: organization_id,
      label: `${organizations[organization_id].code} (${organizations[organization_id].name})`,
    });
  }


  const handleOrganization = (value: string) => {
    handleClose();

    // clear the url params while switching... The reset functions will take info from the url params to pre fill state.
    // So these need cleared before switching
    const current = new URLSearchParams(window.location.search);
    current.forEach((value, key) => {
      current.delete(key);
    });
    // this kind of messes up the back button though, w/e
    window.history.replaceState(null, '', `?${current.toString()}`);
    // window.history.pushState(null, '', `?${current.toString()}`);

    dispatch(setLoading(true));
    dispatch(clearLocalStorage());
    dispatch(updateOrganizationID(value));
    dispatch(resetGames());
    dispatch(resetRanking());
    startTransition(() => {
      const splat = pathName.split('/');

      const path = Organization.getPath({ organizations, organization_id: value });
      const oldPath = Organization.getPath({ organizations, organization_id: selected });

      let newPathName = `/${path}/ranking`;
      if (splat.length === 3) {
        if (splat[2] !== 'compare') {
          newPathName = pathName.replace(`/${oldPath}/`, `/${path}/`);
        }
      }
      // this will error out, first you would need the search params, then you do even know if it is valid, season doesnt exist or team is not in org, etc
      // so just default back to the ranking page
      // else if (splat.length > 3) {
      //   newPathName = `/${path}/${splat[2]}`;
      // }

      if (pathName !== newPathName) {
        router.push(newPathName);
      } else {
        dispatch(setLoading(false));
      }
    });
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
        sx={{ color: (theme.palette.mode === 'light' ? '#fff' : theme.palette.primary.main) }}
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
