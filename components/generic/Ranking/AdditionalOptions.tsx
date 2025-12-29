import React, { useState } from 'react';

// import TripleDotsIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/ranking-slice';
import ConferenceFilterOptions from './ConferenceFilterOptions';
import Menu, { MenuDivider, MenuOption } from '@/components/ux/menu/Menu';
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

  const getMenuOptions = () => {
    const menuOptions: MenuOption[] = [];

    if (view === 'transfer') {
      menuOptions.push({
        value: 'hide-committed-display',
        label: 'Hide committed',
        selectable: true,
        onSelect: handleCommitted,
        icon: hideCommitted ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />
      });
    }

    if (view === 'transfer' || view === 'player') {
      if (width < 700) {
        menuOptions.push({
          value: 'class-year-display',
          label: 'Class filter',
          selectable: true,
          onSelect: handleClassYearFilter,
          icon: <FilterAltIcon fontSize='small' />
        });
      }

      menuOptions.push({
        value: 'hide-small-mins-display',
        label: 'Hide under 2 MPG',
        selectable: true,
        onSelect: handleUnderTwo,
        icon: hideUnderTwoMPG ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />
      });
    }

    if (view === 'transfer') {
      menuOptions.push({
        value: null,
        selectable: false,
        customLabel: <MenuDivider />
      },);

      menuOptions.push({
        value: 'conf-picker-options',
        label: 'Conference filter',
        selectable: true,
        onSelect: handleConferenceFilter,
        icon: <SettingsIcon fontSize='small' />
      });
    }

    return menuOptions;
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
        options = {getMenuOptions()}
      />
      <ConferenceFilterOptions open={confOptionsOpen} onClose = {() => setConfOptionsOpen(false)} />
      <ClassYearPickerDialog open = {classPickerDialogOpen} selected={class_years} openHandler={handleClassYearFilter} closeHandler={() => setClassPickerDialogOpen(false)} />
    </div>
  );
};

export default AdditionalOptions;
