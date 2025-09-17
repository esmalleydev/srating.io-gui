import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import PinIcon from '@mui/icons-material/PushPin';
import { IconButton } from '@mui/material';
// import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';

import AccountHandler from '@/components/generic/AccountHandler';
import { updateGameIds, updateGameSort } from '@/redux/features/favorite-slice';
import { useClientAPI } from '@/components/clientAPI';
import Tooltip from '../ux/hover/Tooltip';

// const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
//   props,
//   ref,
// ) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

const Pin = ({ game_id }: { game_id: string; }) => {
  const dispatch = useAppDispatch();
  const game_ids = useAppSelector((state) => state.favoriteReducer.game_ids);
  const isValidSession = useAppSelector((state) => state.userReducer.isValidSession);

  const theme = useTheme();

  // const [alertOpen, setAlertOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  let selected = false;

  if (
    game_id &&
    game_ids.length &&
    game_ids.indexOf(game_id) > -1
  ) {
    selected = true;
  }


  // const handleAlertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }

  //   setAlertOpen(false);
  // };


  const handleAccountClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAccountOpen(false);
  };

  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (!isValidSession) {
      setAccountOpen(true);
      return;
    }

    if (!game_id) {
      console.warn('No game_id');
      return;
    }

    if (requested) {
      return;
    }

    dispatch(updateGameSort(game_id));
    // update local copy first for responsiveness, then send the call off
    dispatch(updateGameIds(game_id));
    // setAlertOpen(true);
    setRequested(true);

    useClientAPI({
      class: 'favorite',
      function: 'updateFavorite',
      arguments: {
        game_id,
      },
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
      <Tooltip delay={250} text = {'Pin game'}>
        <IconButton color='primary' onClick = {handleFavorite}>
          <PinIcon sx = {pinStyle} fontSize = 'small' />
        </IconButton>
      </Tooltip>
      <AccountHandler open = {accountOpen} closeHandler = {handleAccountClose} loginCallback = {() => {}} />
      {/* <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleAlertClose} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Alert onClose={handleAlertClose} severity = {selected ? 'success' : 'info'} sx={{ width: '100%' }}>
          {selected ? 'Pinned game to top' : 'Removed pin'}
        </Alert>
      </Snackbar> */}
    </>
  );
};

export default Pin;
