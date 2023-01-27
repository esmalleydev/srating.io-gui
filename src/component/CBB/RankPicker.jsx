import React, { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Slide from '@mui/material/Slide';

import Typography from '@mui/material/Typography';

import CheckIcon from '@mui/icons-material/Check';


const Transition = React.forwardRef(
  function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

/**
 * RankPicker
 * @param  {Object} props
 * @param  {Boolean} props.open
 * @param  {Function} props.closeHandler
 * @param  {Function} props.openHandler
 * @param  {Function} props.actionHandler
 * @return {<Dialog>}
 */
const RankPicker = (props) => {

  const selected = props.selected;

  const rankDisplayOptions = [
    {
      'value': 'composite_rank',
      'label': 'Composite',
    },
    {
      'value': 'ap_rank',
      'label': 'AP',
    },
    {
      'value': 'elo_rank',
      'label': 'Elo',
    },
    {
      'value': 'kenpom_rank',
      'label': 'Kenpom',
    },
    {
      'value': 'srs_rank',
      'label': 'SRS',
    },
    {
      'value': 'net_rank',
      'label': 'NET',
    },
    {
      'value': 'coaches_rank',
      'label': 'Coaches Poll',
    },
  ];

  const handleOpen = () => {
    props.openHandler();
  };

  const handleClose = () => {
    props.closeHandler();
  };

  return (
    <Dialog
      open={props.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Pick ranking metric #</DialogTitle>
      <List>
        {rankDisplayOptions.map((rankDisplayOption) => (
          <ListItem key={rankDisplayOption.value} button onClick={() => {
            props.actionHandler(rankDisplayOption.value);
            handleClose();
          }}>
            <ListItemIcon>
              {rankDisplayOption.value === selected ? <CheckIcon /> : ''}
            </ListItemIcon>
            <ListItemText primary={rankDisplayOption.label} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default RankPicker;
