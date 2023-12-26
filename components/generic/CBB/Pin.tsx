import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import PinIcon from '@mui/icons-material/PushPin';
import { IconButton, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';

import Api from '@/components/Api.jsx';
import AccountHandler from '@/components/generic/AccountHandler.jsx';
import { updateCbbGameIds, updateGameSort } from '@/redux/features/favorite-slice';
const api = new Api();

// const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
//   props,
//   ref,
// ) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

const Pin = (props) => {
  const cbb_game_id = props.cbb_game_id || null;

  const dispatch = useAppDispatch();
  const favoriteSlice = useAppSelector(state => state.favoriteReducer.value);
  const userSlice = useAppSelector(state => state.userReducer.value);

  const theme = useTheme();

  // const [alertOpen, setAlertOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  let selected = false;
  let cbb_game_ids = favoriteSlice.cbb_game_ids;

  if (
    cbb_game_id &&
    cbb_game_ids.length &&
    cbb_game_ids.indexOf(cbb_game_id) > -1
  ) {
    selected = true;
  }


  // const handleAlertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }

  //   setAlertOpen(false);
  // };
  
  
  const handleAccountClose = () => {
    setAccountOpen(false);
  };
  
  const handleFavorite = () => {
    if (!userSlice.isValidSession) {
      setAccountOpen(true);
      return;
    }
    
    if (!cbb_game_id) {
      console.warn('No cbb_game_id');
      return;
    }

    if (requested) {
      return;
    }
    
    dispatch(updateGameSort(cbb_game_id));
    // update local copy first for responsiveness, then send the call off
    dispatch(updateCbbGameIds(cbb_game_id));
    // setAlertOpen(true);
    setRequested(true);
    
    api.Request({
      'class': 'favorite',
      'function': 'updateFavorite',
      'arguments': {
        'cbb_game_id': cbb_game_id,
      }
    }).then((favorite) => {
      // do nothing with it, assume the same logic is on the backend
      setRequested(false);
    }).catch((err) => {
      // nothing for now
    });
  };

  const pinStyle: React.CSSProperties = {};
  
  if (selected) {
    pinStyle.color = theme.palette.warning.light;
  }

  return (
    <>
      <IconButton color='primary' onClick = {handleFavorite}>
        <PinIcon sx = {pinStyle} fontSize = 'small' />
      </IconButton>
      <AccountHandler open = {accountOpen} closeHandler = {handleAccountClose} loginCallback = {() => {}} />
      {/* <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleAlertClose} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Alert onClose={handleAlertClose} severity = {selected ? 'success' : 'info'} sx={{ width: '100%' }}>
          {selected ? 'Pinned game to top' : 'Removed pin'}
        </Alert>
      </Snackbar> */}
    </>
  );
}

export default Pin;