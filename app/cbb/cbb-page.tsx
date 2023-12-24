'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import moment from 'moment';

import HelperCBB from '../../components/helpers/CBB';
import HelperGames from '../../components/helpers/Games';

import Api from '../../components/Api.jsx';
import BackdropLoader from '../../components/generic/BackdropLoader';
import Teams from '../../components/generic/CBB/Favorites/Teams';
import Players from '../../components/generic/CBB/Favorites/Players';
import { CircularProgress } from '@mui/material';
import RankedGames from '../../components/generic/CBB/Home/RankedGames.jsx';
import ThrillerGames from '../../components/generic/CBB/Home/ThrillerGames.jsx';
import CloseGames from '../../components/generic/CBB/Home/CloseGames.jsx';
const api = new Api();

let intervalRefresher: NodeJS.Timeout;

const Home = (props) => {
  const self = this;
  const searchParams = useSearchParams();

  interface favoriteDataType {
    favorites: {
      [favorite_id: string]: {
      }
    };
    cbb_games: {
      [cbb_game_id: string]: {}
    };
  };

  const defaultDate = moment().format('YYYY-MM-DD');

  const [request, setRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<favoriteDataType | null>(null);
  const [spin, setSpin] = useState(false);

  const season = searchParams?.get('season') || new HelperCBB().getCurrentSeason();

  const favoriteData = (data && data.favorites) || {};

  const getData = () => {;
    setRequest(true);

    api.Request({
      'class': 'cbb',
      'function': 'loadHomePage',
      'arguments': {
        'season': season,
        'start_date': defaultDate,
      }
    }).then((homeData) => {
      setData(homeData);
      setSpin(false);
      setLoading(false);
    }).catch((err) => {
      // nothing for now
    });
  }

  if (!request) {
    setSpin(true);
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
    'cbb_games': (data && data.cbb_games) || {},
  });

  const topRankedGames = Games.getTopRankedGames();
  const thrillerGames = Games.getThrillerGames();
  const closeGames = Games.getCloseGames();


  return (
    <div style = {{'padding': '20px 20px 0px 20px'}}>
      <BackdropLoader open = {(spin === true)} />
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
