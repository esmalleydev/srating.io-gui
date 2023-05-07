import React, { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Slide from '@mui/material/Slide';

import Typography from '@mui/material/Typography';

import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


const OptionPicker = (props) => {

  const selected = props.selected;

  const title = props.title || 'Title';

  /**
   * Options must be an array of objects with a value and label
   * [{'value': 'foo', 'label': 'Foo'}, {...}]
   * @type {Array}
   */
  const options = props.options || [];

  let selectedLabel = props.selectedLabel || null;

  for (let i = 0; i < options.length; i++) {
    if (selected === options[i].value) {
      selectedLabel = options[i].label;
      break;
    }
  }

  const [open, setOpen] = useState(false);


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        id="conf-picker-button"
        aria-controls={open ? 'conf-picker-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="text"
        disableElevation
        onClick={handleOpen}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {selectedLabel}
      </Button>
      <Dialog
        fullScreen
        open={open}
        // TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {options.map((option) => (
            <ListItem key={option.value} button onClick={() => {
              if (props.actionHandler) {
                props.actionHandler(option.value);
              }
              handleClose();
            }}>
              <ListItemIcon>
                {selected === option.value ? <CheckIcon /> : ''}
              </ListItemIcon>
              <ListItemText primary={option.label} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </div>
  );
}

export default OptionPicker;