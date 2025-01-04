'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';

import CheckIcon from '@mui/icons-material/Check';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setRank } from '@/redux/features/display-slice';
import Organization from '@/components/helpers/Organization';


/**
 * RankPicker
 * @param  {Object} props
 * @param  {Boolean} props.open
 * @param  {Function} props.closeHandler
 * @param  {Function} props.openHandler
 * @return {<Dialog>}
 */
const RankPicker = (
  { open, closeHandler, openHandler } :
  { open: boolean; closeHandler: () => void; openHandler: () => void },
) => {
  const dispatch = useAppDispatch();

  const selected = useAppSelector((state) => state.displayReducer.rank);
  const isCBB = Organization.isCBB();

  let rankDisplayOptions = [
    {
      value: 'rank',
      label: 'sRating',
    },
    {
      value: 'ap_rank',
      label: 'AP',
    },
    {
      value: 'elo_rank',
      label: 'SR Elo',
    },
  ];

  if (isCBB) {
    rankDisplayOptions = rankDisplayOptions.concat([
      {
        value: 'kenpom_rank',
        label: 'Kenpom',
      },
      {
        value: 'srs_rank',
        label: 'SRS',
      },
      {
        value: 'net_rank',
        label: 'NET',
      },
    ]);
  }

  rankDisplayOptions = rankDisplayOptions.concat([
    {
      value: 'coaches_rank',
      label: 'Coaches Poll',
    },
  ]);

  const handleOpen = () => {
    openHandler();
  };

  const handleClose = () => {
    closeHandler();
  };

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-rank-picker-description"
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
};

export default RankPicker;
