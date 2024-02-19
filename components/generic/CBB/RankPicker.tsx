import React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';

import CheckIcon from '@mui/icons-material/Check';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setRank } from '@/redux/features/display-slice';


/**
 * RankPicker
 * @param  {Object} props
 * @param  {Boolean} props.open
 * @param  {Function} props.closeHandler
 * @param  {Function} props.openHandler
 * @return {<Dialog>}
 */
const RankPicker = (props) => {
  const dispatch = useAppDispatch();
  
  const selected = useAppSelector(state => state.displayReducer.rank);

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
      'label': 'sRating',
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
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Pick ranking metric #</DialogTitle>
      <List>
        {rankDisplayOptions.map((rankDisplayOption) => (
          <ListItem key={rankDisplayOption.value} button onClick={() => {
            dispatch(setRank(rankDisplayOption.value));
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
