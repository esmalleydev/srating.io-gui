import React, { useState, useTransition } from 'react';

// import TripleDotsIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setHideCommitted, setHideUnderTwoMPG } from '@/redux/features/ranking-slice';
import BackdropLoader from '@/components/generic/BackdropLoader';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const AdditionalOptions = ({ view }: {view: string}) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [spin, setSpin] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const dispatch = useAppDispatch();
  const hideCommitted = useAppSelector(state => state.rankingReducer.hideCommitted);
  const hideUnderTwoMPG = useAppSelector(state => state.rankingReducer.hideUnderTwoMPG);


  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const handleCommitted = () => {
    const newValue: boolean = !hideCommitted;
    handleClose();
    setSpin(true);
    startTransition(() => {
      if (newValue !== hideCommitted) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('hideCommitted', (+newValue).toString());
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.replace(`${pathName}${query}`);
        dispatch(setHideCommitted(newValue));
      }
      setSpin(false);
    });
  };

  const handleUnderTwo = () => {
    const newValue: boolean = !hideUnderTwoMPG;
    handleClose();
    setSpin(true);
    startTransition(() => {
      if (newValue !== hideUnderTwoMPG) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('hideUnderTwoMPG', (+newValue).toString());
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.replace(`${pathName}${query}`);
        dispatch(setHideUnderTwoMPG(newValue));
      }
      setSpin(false);
    });
  };

  const getMenuItems = () => {
    const menuItems: React.JSX.Element[] = [];

    if (view === 'transfer') {
      menuItems.push(
        <MenuItem key='hide-committed-display' onClick={() => {
          handleCommitted();
        }}>
          <ListItemIcon>
            {hideCommitted ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />}
          </ListItemIcon>
          <ListItemText>Hide committed</ListItemText>
        </MenuItem>
      );
    }

    if (view === 'transfer' || view === 'player') {
      menuItems.push(
        <MenuItem key='hide-small-mins-display' onClick={() => {
          handleUnderTwo();
        }}>
          <ListItemIcon>
            {hideUnderTwoMPG ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />}
          </ListItemIcon>
          <ListItemText>Hide under 2 MPG</ListItemText>
        </MenuItem>
      );
    }

    return menuItems;
  };


  return (
    <div>
      <BackdropLoader open = {spin} />
      <Tooltip title = {'Additional filters'}>
        <IconButton
            id="additional-filters"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleOpen}
          >
            <SettingsIcon />
        </IconButton>
        </Tooltip>
        <Menu
          id="long-menu"
          anchorEl={anchor}
          open={open}
          onClose={handleClose}
        >
          {getMenuItems()}
        </Menu>
    </div>
  );
}

export default AdditionalOptions;