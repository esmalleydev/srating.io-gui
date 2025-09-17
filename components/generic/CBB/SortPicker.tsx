'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';

import CheckIcon from '@mui/icons-material/Check';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ListItemButton } from '@mui/material';
import { setDataKey } from '@/redux/features/display-slice';


/**
 * SortPicker
 * @param  {Object} props
 * @param  {Boolean} props.open
 * @param  {Function} props.closeHandler
 * @param  {Function} props.openHandler
 * @return {<Dialog>}
 */
const SortPicker = ({ open, openHandler, closeHandler }) => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.displayReducer.picksSort);

  const options = [
    {
      value: 'start_time',
      label: 'Start time',
    },
    {
      value: 'win_percentage',
      label: 'Highest win percentage',
    },
    // {
    //   'value': 'best_value',
    //   'label': 'Best value',
    // },
  ];

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
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Sort order</DialogTitle>
      <List>
        {options.map((option) => (
          <ListItemButton key={option.value} onClick={() => {
            dispatch(setDataKey({ key: 'picksSort', value: option.value }));
            handleClose();
          }}>
            <ListItemIcon>
              {option.value === selected ? <CheckIcon /> : ''}
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
};

export default SortPicker;
