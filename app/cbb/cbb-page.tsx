'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import moment from 'moment';

import HelperCBB from '../../components/helpers/CBB';
import HelperGames from '../../components/helpers/Games';

import Teams from '../../components/generic/CBB/Favorites/Teams';
import Players from '../../components/generic/CBB/Favorites/Players';
import { CircularProgress } from '@mui/material';
import RankedGames from '../../components/generic/CBB/Home/RankedGames.jsx';
import ThrillerGames from '../../components/generic/CBB/Home/ThrillerGames.jsx';
import CloseGames from '../../components/generic/CBB/Home/CloseGames.jsx';
import { useClientAPI } from '@/components/clientAPI';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading as setLoadingDisplay } from '@/redux/features/display-slice';

let intervalRefresher: NodeJS.Timeout;

const Home = () => {
  const self = this;
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  interface favoriteDataType {
    favorites: {
      [favorite_id: string]: {
      }
    };
    games: {
      [game_id: string]: {}
    };
  };

  const defaultDate = moment().format('YYYY-MM-DD');

  const [request, setRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<favoriteDataType | null>(null);

  const season = searchParams?.get('season') || new HelperCBB().getCurrentSeason();

  const favoriteData = (data && data.favorites) || {};

  const getData = () => {;
    setRequest(true);

    useClientAPI({
      'class': 'cbb',
      'function': 'loadHomePage',
      'arguments': {
        'season': season,
        'start_date': defaultDate,
      }
    }).then((homeData) => {
      setData(homeData);
      dispatch(setLoadingDisplay(false));
      setLoading(false);
    }).catch((err) => {
      // nothing for now
    });
  }

  if (!request) {
    dispatch(setLoadingDisplay(true));
    setLoading(true);
    getData();
  }

  useEffect(() => {
    intervalRefresher = setInterval(function() {
      getData()
    }, 30000);
  
    return function clean_up() {
      clearInterval(intervalRefresher);
    };
  });

  const Games = new HelperGames({
    'games': (data && data.games) || {},
  });

  const topRankedGames = Games.getTopRankedGames();
  const thrillerGames = Games.getThrillerGames();
  const closeGames = Games.getCloseGames();


  return (
    <div style = {{'padding': '20px 20px 0px 20px'}}>
      {
        loading ?
        <div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div> :
        <>
          <RankedGames games = {topRankedGames} />
          <ThrillerGames games = {thrillerGames} />
          <CloseGames games = {closeGames} />
          <Teams favorite = {favoriteData && favoriteData.favorite} schedule = {favoriteData && favoriteData.schedule} teams = {favoriteData && favoriteData.teams} />
          <Players favorite = {favoriteData && favoriteData.favorite} gamelogs = {favoriteData && favoriteData.gamelog} players = {favoriteData && favoriteData.players} player_team_seasons = {favoriteData && favoriteData.player_team_seasons} />
        </>
      }
    </div>
  );
}



export default Home;
