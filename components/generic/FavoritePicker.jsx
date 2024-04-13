'use client';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconButton, Tooltip } from '@mui/material';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';

import AccountHandler from '@/components/generic/AccountHandler';
import { setPlayerIds, setTeamIds } from '@/redux/features/favorite-slice.ts';
import { useClientAPI } from '@/components/clientAPI';

const FavoritePicker = (props) => {
  const theme = useTheme();
  const team_id = props.team_id || null;
  const player_id = props.player_id || null;

  const dispatch = useAppDispatch();
  const favorite_team_ids = useAppSelector(state => state.favoriteReducer.team_ids);
  const favorite_player_ids = useAppSelector(state => state.favoriteReducer.player_ids);
  const isValidSession = useAppSelector(state => state.userReducer.isValidSession);
  
  const [requested, setRequested] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  let selected = false;

  if (
    (
      team_id &&
      favorite_team_ids.length &&
      favorite_team_ids.indexOf(team_id) > -1
    ) ||
    (
      player_id &&
      favorite_player_ids.length &&
      favorite_player_ids.indexOf(player_id) > -1
    )
  ) {
    selected = true;
  }


  const handleAccountClose = () => {
    setAccountOpen(false);
  };

  const handleFavorite = () => {
    if (!isValidSession) {
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
    
    useClientAPI({
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