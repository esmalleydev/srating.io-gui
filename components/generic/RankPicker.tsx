'use client';


import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';

import CheckIcon from '@mui/icons-material/Check';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Organization from '@/components/helpers/Organization';
import { ListItemButton } from '@mui/material';
import { setDataKey } from '@/redux/features/display-slice';
import Modal from '../ux/container/Modal';
import Typography from '../ux/text/Typography';
import { useTheme } from '../hooks/useTheme';


/**
 * RankPicker
 */
const RankPicker = (
  { open, closeHandler, openHandler } :
  { open: boolean; closeHandler: () => void; openHandler: () => void },
) => {
  const theme = useTheme();
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
      label: 'sRating Elo',
    },
  ];

  // if (isCBB) {
  //   rankDisplayOptions = rankDisplayOptions.concat([
  //     {
  //       value: 'kenpom_rank',
  //       label: 'Kenpom',
  //     },
  //     {
  //       value: 'srs_rank',
  //       label: 'SRS',
  //     },
  //     {
  //       value: 'net_rank',
  //       label: 'NET',
  //     },
  //   ]);
  // }

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
    <Modal
      open={open}
      onClose={handleClose}
      aria-describedby="alert-dialog-rank-picker-description"
    >
      <Typography type = 'h6'>Rank metric</Typography>
      <Typography type = 'caption' style = {{ color: theme.text.secondary }}>Pick which ranking # to display next to a team.</Typography>
      <List>
        {rankDisplayOptions.map((rankDisplayOption) => (
          <ListItemButton key={rankDisplayOption.value} onClick={() => {
            dispatch(setDataKey({ key: 'rank', value: rankDisplayOption.value }));
            handleClose();
          }}>
            <ListItemIcon>
              {rankDisplayOption.value === selected ? <CheckIcon /> : ''}
            </ListItemIcon>
            <ListItemText primary={rankDisplayOption.label} />
          </ListItemButton>
        ))}
      </List>
    </Modal>
  );
};

export default RankPicker;
