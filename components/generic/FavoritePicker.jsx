import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton } from '@mui/material';

import Api from './../Api.jsx';
import AccountHandler from './AccountHandler.jsx';
const api = new Api();

const FavoritePicker = (props) => {
  const theme = useTheme();
  const team_id = props.team_id || null;
  const player_id = props.player_id || null;

  const sessionDataKey = 'FAVORITE';

  // this wil get cleared when clicking scores again, but if I arrived here from a back button we want to preserve the state
  let sessionData = typeof window !== 'undefined' && sessionStorage.getItem(sessionDataKey) ? JSON.parse(sessionStorage.getItem(sessionDataKey)) : {};
  
  const [request, setRequest] = useState(sessionData.request || false);
  const [favorite, setFavorite] = useState(sessionData.favorite || {});
  const [accountOpen, setAccountOpen] = useState(false);

  let selected = false;

  if (
    favorite &&
    (
      (
        team_id &&
        favorite.json_team_ids &&
        favorite.json_team_ids.length &&
        favorite.json_team_ids.indexOf(team_id) > -1
      ) ||
      (
        player_id &&
        favorite.json_player_ids &&
        favorite.json_player_ids.length &&
        favorite.json_player_ids.indexOf(player_id) > -1
      )
    )
  ) {
    selected = true;
  }


  const session_id = (typeof window !== 'undefined' && localStorage.getItem('session_id')) || null;

  const triggerSessionStorage = () => {
    sessionStorage.setItem(sessionDataKey, JSON.stringify({
      'request': request,
      'favorite': favorite,
    }));
  };

  useEffect(() => {
    triggerSessionStorage();
  }, [request, favorite]);

  const getFavorite = () => {
    setRequest(true);
    
    api.Request({
      'class': 'favorite',
      'function': 'getFavorite',
      'arguments': {}
    }).then((favorite) => {
      setFavorite(favorite);
    }).catch((err) => {
      // nothing for now
    });
  };

  if (session_id && !request) {
    getFavorite();
  }

  const handleAccountClose = () => {
    setAccountOpen(false);
  };

  const handleFavorite = () => {
    if (!session_id) {
      setAccountOpen(true);
      return;
    }

    let args = {};

    if (team_id) {
      args.team_id = team_id;
    }

    if (player_id) {
      args.player_id = player_id;
    }

    api.Request({
      'class': 'favorite',
      'function': 'updateFavorite',
      'arguments': args
    }).then((favorite) => {
      setFavorite(favorite);
    }).catch((err) => {
      // nothing for now
    });
  };

  const favoriteStyle = {};
  
  if (selected) {
    favoriteStyle.color = theme.palette.warning.light;
  }

  return (
    <>
      <IconButton color='primary' onClick = {handleFavorite}>
        <FavoriteIcon sx = {favoriteStyle} fontSize = 'small' />
      </IconButton>
      <AccountHandler open = {accountOpen} closeHandler = {handleAccountClose} loginCallback = {() => {}} />
    </>
  );
}

export default FavoritePicker;