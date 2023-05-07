import React, { useState } from 'react';


import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
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


const ColumnPicker = (props) => {

  const options = props.options;
  const [columns, setColumns] = useState(props.selected || []);

  return (
    <div>
     <Dialog
        fullScreen
        open={props.open}
        // TransitionComponent={Transition}
        keepMounted
        onClose={() => {props.closeHandler()}}
        aria-describedby="alert-dialog-slide-description"
        scroll = 'paper'
      >
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {props.closeHandler()}}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Set custom table columns
            </Typography>
            <Button autoFocus color="inherit" onClick={() => {props.saveHandler(columns);}}>Save</Button>
          </Toolbar>
        </AppBar>
        <DialogContent sx = {{'padding': 0}}>
          <List style = {{'marginBottom': 60}}>
            {Object.values(options).map((option) => (
              <ListItem key={option.id} button disabled = {(option.disabled === true)} onClick={() => {
                let currentColumns = [...columns];
                const index = currentColumns.indexOf(option.id);

                if (index > -1) {
                  currentColumns.splice(index, 1);
                } else {
                  currentColumns.push(option.id);
                }

                setColumns(currentColumns);
              }}>
                <ListItemIcon>
                  {columns.indexOf(option.id) > -1 ? <CheckIcon /> : ''}
                </ListItemIcon>
                <ListItemText primary={option.label} secondary = {option.tooltip} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ColumnPicker;