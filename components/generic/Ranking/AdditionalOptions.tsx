import React, { useState } from 'react';

// import TripleDotsIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';

import IconButton from '@mui/material/IconButton';

import { Divider } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/ranking-slice';
import ConferenceFilterOptions from './ConferenceFilterOptions';
import Menu from '@/components/ux/menu/Menu';
import MenuList from '@/components/ux/menu/MenuList';
import MenuItem from '@/components/ux/menu/MenuItem';
import MenuListIcon from '@/components/ux/menu/MenuListIcon';
import MenuListText from '@/components/ux/menu/MenuListText';
import Tooltip from '@/components/ux/hover/Tooltip';

const AdditionalOptions = ({ view }: {view: string}) => {
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
    if (newValue !== hideCommitted) {
      dispatch(setDataKey({ key: 'hideCommitted', value: newValue }));
    }
  };

  const handleUnderTwo = () => {
    const newValue: boolean = !hideUnderTwoMPG;
    handleClose();
    if (newValue !== hideUnderTwoMPG) {
      dispatch(setDataKey({ key: 'hideUnderTwoMPG', value: newValue }));
    }
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
      <Tooltip onClickRemove text = {'Additional filters'}>
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
