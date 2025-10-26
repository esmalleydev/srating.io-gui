'use client';

import { useState } from 'react';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';

import Typography from '@mui/material/Typography';

import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ListItemButton } from '@mui/material';
import { updateDataKey } from '@/redux/features/display-slice';

// Currently not in use, if you do want to use this again, update it to put conferences in url params

const ConferencePickerFull = () => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.displayReducer.conferences);
  const conferences = useAppSelector((state) => state.dictionaryReducer.conference);

  const { width } = useWindowDimensions() as Dimensions;

  const [confOpen, setConfOpen] = useState(false);

  type conferenceOption = {
    value: string | null;
    label: string;
  };

  const conferenceOptions: conferenceOption[] = [
    { value: null, label: 'All' },
  ];

  for (const conference_id in conferences) {
    const row = conferences[conference_id];
    if (row.inactive === 0) {
      let label = row.code;
      if (row.code.toLowerCase() === row.name.toLowerCase()) {
        label = row.name;
      }
      conferenceOptions.push({
        value: row.conference_id,
        label,
      });
    }
  }

  // rip PAC-12, you are now garbo
  const priority = [
    'a9f23620-1095-11ef-9686-72fab666226a', // Big 12
    'a933edfd-1095-11ef-9686-72fab666226a', // ACC
    'aa230787-1095-11ef-9686-72fab666226a', // Big east
    'aaa5086f-1095-11ef-9686-72fab666226a', // Big ten
    'ad5f5c4f-1095-11ef-9686-72fab666226a', // SEC
  ];

  conferenceOptions.sort((a, b) => {
    // sort all first
    if (!a.value) {
      return -1;
    }
    if (!b.value) {
      return 1;
    }

    // other
    if (a.value === '006bbb2b-10c2-11ef-9686-72fab666226a') {
      return 1;
    }
    if (b.value === '006bbb2b-10c2-11ef-9686-72fab666226a') {
      return -1;
    }

    // sort priority first
    if (priority.indexOf(a.value) > -1 && priority.indexOf(b.value) === -1) {
      return -1;
    }
    if (priority.indexOf(b.value) > -1 && priority.indexOf(a.value) === -1) {
      return 1;
    }

    // sort alphabetically
    return a.label.localeCompare(b.label);
  });


  const handleConfOpen = () => {
    setConfOpen(true);
  };

  const handleConfClose = () => {
    setConfOpen(false);
  };

  return (
    <div>
      <Button
        id="conf-picker-button"
        aria-controls={confOpen ? 'conf-picker-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={confOpen ? 'true' : undefined}
        variant="text"
        disableElevation
        onClick={handleConfOpen}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {width < 500 ? 'Conf.' : 'Conferences'}
      </Button>
      <Dialog
        fullScreen
        open={confOpen}
        // TransitionComponent={Transition}
        keepMounted
        onClose={handleConfClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleConfClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Conferences
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {conferenceOptions.map((confOption) => {
            const { value } = confOption;

            return (
              <ListItemButton key={value} onClick={() => {
                const v = value || [];
                dispatch(updateDataKey({ key: 'conferences', value: v }));
                handleConfClose();
              }}>
                <ListItemIcon>
                  {value && selected.indexOf(value) > -1 ? <CheckIcon /> : ''}
                </ListItemIcon>
                <ListItemText primary={confOption.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Dialog>
    </div>
  );
};

export default ConferencePickerFull;
