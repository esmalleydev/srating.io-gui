import React, { useState, useTransition } from 'react';

// import TripleDotsIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';

import IconButton from '@mui/material/IconButton';

import { Divider, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/ranking-slice';
import { useSearchParams } from 'next/navigation';
import ConferenceFilterOptions from './ConferenceFilterOptions';
import Menu from '@/components/ux/menu/Menu';
import MenuList from '@/components/ux/menu/MenuList';
import MenuItem from '@/components/ux/menu/MenuItem';
import MenuListIcon from '@/components/ux/menu/MenuListIcon';
import MenuListText from '@/components/ux/menu/MenuListText';

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
          <MenuListIcon>
            {hideCommitted ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />}
          </MenuListIcon>
          <MenuListText primary ='Hide committed' />
        </MenuItem>,
      );
    }

    if (view === 'transfer' || view === 'player') {
      menuItems.push(
        <MenuItem key='hide-small-mins-display' onClick={() => {
          handleUnderTwo();
        }}>
          <MenuListIcon>
            {hideUnderTwoMPG ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />}
          </MenuListIcon>
          <MenuListText primary ='Hide under 2 MPG' />
        </MenuItem>,
      );
    }

    if (view === 'transfer') {
      menuItems.push(<Divider key = {'transfer-divider'} />);

      menuItems.push(
        <MenuItem key='conf-picker-options' onClick={() => {
          handleConferenceFilter();
        }}>
          <MenuListIcon>
            <SettingsIcon fontSize='small' />
          </MenuListIcon>
          <MenuListText primary ='Conference filter' />
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
        anchor={anchor}
        open={open}
        onClose={handleClose}
      >
        <MenuList>
          {getMenuItems()}
        </MenuList>
      </Menu>
      <ConferenceFilterOptions open={confOptionsOpen} onClose = {() => setConfOptionsOpen(false)} />
    </div>
  );
};

export default AdditionalOptions;
