import React, { useState, useTransition } from 'react';

// import TripleDotsIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { Divider, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/ranking-slice';
import { useSearchParams } from 'next/navigation';
import ConferenceFilterOptions from './ConferenceFilterOptions';

const AdditionalOptions = ({ view }: {view: string}) => {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [anchor, setAnchor] = useState(null);
  const [confOptionsOpen, setConfOptionsOpen] = useState(false);
  const open = Boolean(anchor);

  const dispatch = useAppDispatch();
  const hideCommitted = useAppSelector((state) => state.rankingReducer.hideCommitted);
  const hideUnderTwoMPG = useAppSelector((state) => state.rankingReducer.hideUnderTwoMPG);


  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const handleCommitted = () => {
    const newValue: boolean = !hideCommitted;
    handleClose();
    startTransition(() => {
      if (newValue !== hideCommitted) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('hideCommitted', (+newValue).toString());

        // we dont need the router replace here, it will trigger a server re-render, but nothing is changing from the server, these are gui filters
        // const search = current.toString();
        // const query = search ? `?${search}` : '';
        // router.replace(`${pathName}${query}`);

        window.history.replaceState(null, '', `?${current.toString()}`);

        // use pushState if we want to add to back button history
        // window.history.pushState(null, '', `?${current.toString()}`);

        dispatch(setDataKey({ key: 'hideCommitted', value: newValue }));
      }
    });
  };

  const handleUnderTwo = () => {
    const newValue: boolean = !hideUnderTwoMPG;
    handleClose();
    // dispatch(setLoading(true));
    startTransition(() => {
      if (newValue !== hideUnderTwoMPG) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('hideUnderTwoMPG', (+newValue).toString());

        // we dont need the router replace here, it will trigger a server re-render, but nothing is changing from the server, these are gui filters
        // const search = current.toString();
        // const query = search ? `?${search}` : '';
        // router.replace(`${pathName}${query}`);

        window.history.replaceState(null, '', `?${current.toString()}`);

        // use pushState if we want to add to back button history
        // window.history.pushState(null, '', `?${current.toString()}`);

        dispatch(setDataKey({ key: 'hideUnderTwoMPG', value: newValue }));
      }
    });
  };

  const handleConferenceFilter = () => {
    handleClose();
    setConfOptionsOpen(true);
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
        </MenuItem>,
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
        </MenuItem>,
      );
    }

    if (view === 'transfer') {
      menuItems.push(<Divider key = {'transfer-divider'} />);

      menuItems.push(
        <MenuItem key='conf-picker-options' onClick={() => {
          handleConferenceFilter();
        }}>
          <ListItemIcon>
            <SettingsIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Conference filter</ListItemText>
        </MenuItem>,
      );
    }

    return menuItems;
  };


  return (
    <div>
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
      <ConferenceFilterOptions open={confOptionsOpen} onClose = {() => setConfOptionsOpen(false)} />
    </div>
  );
};

export default AdditionalOptions;
