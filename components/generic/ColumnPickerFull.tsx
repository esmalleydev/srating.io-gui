'use client';

import { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import { ListItemButton } from '@mui/material';
import { TableColumnsType } from '../helpers/TableColumns';


const ColumnPickerFull = (
  { options, selected, open, saveHandler, closeHandler, limit, title = 'Set custom table columns' }:
  { options: TableColumnsType, selected: Array<string>, open: boolean, saveHandler: (columns: string[]) => void, closeHandler: () => void, limit?: number, title?: string },
) => {
  const [columns, setColumns] = useState(selected || []);

  return (
    <div>
     <Dialog
        fullScreen
        open={open}
        // TransitionComponent={Transition}
        keepMounted
        onClose={() => { closeHandler(); }}
        aria-describedby="alert-dialog-slide-description"
        scroll = 'paper'
      >
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => { closeHandler(); }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>
            <Button autoFocus color="inherit" onClick={() => { saveHandler(columns); }}>Save</Button>
          </Toolbar>
        </AppBar>
        <DialogContent sx = {{ padding: 0 }}>
          <List style = {{ marginBottom: 60 }}>
            {Object.values(options).map((option) => (
              <ListItemButton key={option.id} disabled = {(option.disabled === true)} onClick={() => {
                let autoClose = false;
                const currentColumns = [...columns];
                const index = currentColumns.indexOf(option.id);

                if (index > -1) {
                  currentColumns.splice(index, 1);
                } else {
                  currentColumns.push(option.id);
                }

                // auto close if limit is reached
                if (limit && currentColumns.length >= limit) {
                  autoClose = true;
                }

                // remove first if greater than limit
                if (limit && currentColumns.length > limit) {
                  currentColumns.shift();
                }

                setColumns(currentColumns);

                if (autoClose) {
                  saveHandler(currentColumns);
                }
              }}>
                <ListItemIcon>
                  {columns.indexOf(option.id) > -1 ? <CheckIcon /> : ''}
                </ListItemIcon>
                <ListItemText primary={option.label} secondary = {option.tooltip} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ColumnPickerFull;
