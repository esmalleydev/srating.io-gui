'use client';

import { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';

import AccountHandler from '@/components/generic/AccountHandler';
import { setPlayerIds, setTeamIds } from '@/redux/features/favorite-slice';
import { useClientAPI } from '@/components/clientAPI';
import Tooltip from '../ux/hover/Tooltip';
import { useTheme } from '../hooks/useTheme';
import IconButton from '../ux/buttons/IconButton';

const FavoritePicker = (
  { team_id = null, player_id = null }:
  { team_id?: string | null; player_id?: string| null },
) => {
  const theme = useTheme();

  const dispatch = useAppDispatch();
  const favorite_team_ids = useAppSelector((state) => state.favoriteReducer.team_ids);
  const favorite_player_ids = useAppSelector((state) => state.favoriteReducer.player_ids);
  const isValidSession = useAppSelector((state) => state.userReducer.isValidSession);

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

    const args: { team_id?: string; player_id?: string; } = {};

    if (team_id) {
      args.team_id = team_id;
    }

    if (player_id) {
      args.player_id = player_id;
    }

    useClientAPI({
      class: 'favorite',
      function: 'updateFavorite',
      arguments: args,
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

  const favoriteStyle: React.CSSProperties = {};

  if (selected) {
    favoriteStyle.color = theme.warning.light;
  }

  return (
    <>
      <Tooltip onClickRemove text = {'Save favorite'}>
        <IconButton onClick = {handleFavorite} value = 'favorite' icon = {<FavoriteIcon sx = {favoriteStyle} fontSize = 'small' />} />
      </Tooltip>
      <AccountHandler open = {accountOpen} closeHandler = {handleAccountClose} loginCallback = {() => {}} />
    </>
  );
};

export default FavoritePicker;
