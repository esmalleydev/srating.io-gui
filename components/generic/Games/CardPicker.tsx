'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';

import CheckIcon from '@mui/icons-material/Check';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ListItemButton } from '@mui/material';
import { setDataKey } from '@/redux/features/display-slice';
import { useTheme } from '@/components/hooks/useTheme';


/**
 * CardPicker
 * @param  {Object} props
 * @param  {Boolean} props.open
 * @param  {Function} props.closeHandler
 * @param  {Function} props.openHandler
 * @return {<Dialog>}
 */
const CardPicker = (
  { open, closeHandler, openHandler } :
  { open: boolean; closeHandler: () => void; openHandler: () => void },
) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const selected = useAppSelector((state) => state.displayReducer.cardsView);

  const cardDisplayOptions = [
    {
      value: 'large',
      label: 'Large',
      icon: <ViewModuleIcon fontSize='small' />,
    },
    {
      value: 'compact',
      label: 'Compact',
      icon: <ViewDayIcon fontSize='small' />,
    },
    {
      value: 'super_compact',
      label: 'Super Compact',
      icon: <ViewCompactIcon fontSize='small' />,
    },
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
      aria-describedby="alert-dialog-card-picker-description"
    >
      <DialogTitle>Pick card view mode</DialogTitle>
      <List>
        {cardDisplayOptions.map((option) => (
          <ListItemButton key={option.value} onClick={() => {
            dispatch(setDataKey({ key: 'cardsView', value: option.value }));
            handleClose();
          }}>
            <ListItemIcon>
              {option.value === selected ? <CheckIcon style={{ color: theme.success.main }} /> : option.icon}
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
};

export default CardPicker;
