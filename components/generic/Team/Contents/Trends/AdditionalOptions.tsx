'use client';

import { useState } from 'react';

// import TripleDotsIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/team-slice';

const AdditionalOptions = () => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const dispatch = useAppDispatch();
  const trendsBoxscoreLine = useAppSelector((state) => state.teamReducer.trendsBoxscoreLine);


  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const handleTrendsBoxscore = () => {
    const newValue: boolean = !trendsBoxscoreLine;
    dispatch(setDataKey({ key: 'trendsBoxscoreLine', value: newValue }));
    handleClose();
  };

  const getMenuItems = () => {
    const menuItems: React.JSX.Element[] = [];

    menuItems.push(
      <MenuItem key='show-boxscore-line' onClick={() => {
        handleTrendsBoxscore();
      }}>
        <ListItemIcon>
          {trendsBoxscoreLine ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />}
        </ListItemIcon>
        <ListItemText>Show boxscore data</ListItemText>
      </MenuItem>,
    );

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
    </div>
  );
};

export default AdditionalOptions;
