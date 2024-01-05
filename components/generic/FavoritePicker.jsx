'use client';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton, Tooltip } from '@mui/material';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';

import Api from './../Api.jsx';
import AccountHandler from './AccountHandler.jsx';
import { setPlayerIds, setTeamIds } from '@/redux/features/favorite-slice.ts';
const api = new Api();

const FavoritePicker = (props) => {
  const theme = useTheme();
  const team_id = props.team_id || null;
  const player_id = props.player_id || null;

  const dispatch = useAppDispatch();
  const favoriteSlice = useAppSelector(state => state.favoriteReducer.value);
  const userSlice = useAppSelector(state => state.userReducer.value);
  
  const [requested, setRequested] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  let selected = false;

  if (
    (
      team_id &&
      favoriteSlice.team_ids.length &&
      favoriteSlice.team_ids.indexOf(team_id) > -1
    ) ||
    (
      player_id &&
      favoriteSlice.player_ids.length &&
      favoriteSlice.player_ids.indexOf(player_id) > -1
    )
  ) {
    selected = true;
  }


  const handleAccountClose = () => {
    setAccountOpen(false);
  };

  const handleFavorite = () => {
    if (!userSlice.isValidSession) {
      setAccountOpen(true);
      return;
    }

    if (requested) {
      return;
    }

    setRequested(true);
    
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
      if (favorite && favorite.json_team_ids && favorite.json_team_ids.length) {
        dispatch(setTeamIds(favorite.json_team_ids));
      }
      if (favorite && favorite.json_player_ids && favorite.json_player_ids.length) {
        dispatch(setPlayerIds(favorite.json_player_ids));
      }
      setRequested(false);
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
      <Tooltip enterTouchDelay={1000} disableFocusListener title={'Save favorite'}>
        <IconButton color='primary' onClick = {handleFavorite}>
          <FavoriteIcon sx = {favoriteStyle} fontSize = 'small' />
        </IconButton>
      </Tooltip>
      <AccountHandler open = {accountOpen} closeHandler = {handleAccountClose} loginCallback = {() => {}} />
    </>
  );
}

export default FavoritePicker;