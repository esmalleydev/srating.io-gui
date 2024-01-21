'use client';
import { useState} from "react";

import { useAppSelector, useAppDispatch } from '@/redux/hooks';

import { setCbbGameIds, setPlayerIds, setTeamIds } from "@/redux/features/favorite-slice";
import { useClientAPI } from '@/components/clientAPI';



const FavoriteHandler = () => {
  const dispatch = useAppDispatch();
  const userSlice = useAppSelector(state => state.userReducer.value);

  const validSession = userSlice.isValidSession;

  const [requested, setRequested] = useState(false);


  if (!requested && validSession) {
    setRequested(true);
    useClientAPI({
      'class': 'favorite',
      'function': 'getFavorite',
      'arguments': {}
    }).then((favorite) => {
      if (favorite && favorite.json_team_ids && favorite.json_team_ids.length) {
        dispatch(setTeamIds(favorite.json_team_ids));
      }
      if (favorite && favorite.json_player_ids && favorite.json_player_ids.length) {
        dispatch(setPlayerIds(favorite.json_player_ids));
      }
      if (favorite && favorite.json_cbb_game_ids && favorite.json_cbb_game_ids.length) {
        dispatch(setCbbGameIds(favorite.json_cbb_game_ids));
      }
    }).catch((err) => {
      // nothing for now
    });
  }

  return null;
};

export default FavoriteHandler;
