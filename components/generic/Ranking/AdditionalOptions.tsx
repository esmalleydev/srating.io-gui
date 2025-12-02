import React, { useState } from 'react';

// import TripleDotsIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

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
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { ClassYearPickerDialog } from './ClassYearPicker';
import IconButton from '@/components/ux/buttons/IconButton';

const AdditionalOptions = ({ view }: {view: string}) => {
  const { width } = useWindowDimensions() as Dimensions;
  const [anchor, setAnchor] = useState(null);
  const [classPickerDialogOpen, setClassPickerDialogOpen] = useState(false);
  const [confOptionsOpen, setConfOptionsOpen] = useState(false);
  const open = Boolean(anchor);

  const dispatch = useAppDispatch();
  const hideCommitted = useAppSelector((state) => state.rankingReducer.hideCommitted);
  const hideUnderTwoMPG = useAppSelector((state) => state.rankingReducer.hideUnderTwoMPG);
  const class_years = useAppSelector((state) => state.rankingReducer.class_years);


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

  const handleClassYearFilter = () => {
    handleClose();
    setClassPickerDialogOpen(true);
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
      if (width < 700) {
        menuItems.push(
          <MenuItem key='class-year-display' onClick={() => {
            handleClassYearFilter();
          }}>
            <MenuListIcon>
              <FilterAltIcon fontSize='small' />
            </MenuListIcon>
            <MenuListText primary ='Class filter' />
          </MenuItem>,
        );
      }

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
    <div style={{ display: 'flex' }}>
      <Tooltip onClickRemove text = {'Additional filters'}>
        <IconButton
          value="additional-filters"
          onClick={handleOpen}
          icon = {<SettingsIcon />}
        />
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
      <ClassYearPickerDialog open = {classPickerDialogOpen} selected={class_years} openHandler={handleClassYearFilter} closeHandler={() => setClassPickerDialogOpen(false)} />
    </div>
  );
};

export default AdditionalOptions;
