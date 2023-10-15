import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import HelperCBB from '../../components/helpers/CBB';

import Api from '../../components/Api.jsx';
import BackdropLoader from '../../components/generic/BackdropLoader';
import Teams from '../../components/generic/CBB/Favorites/Teams';
import Players from '../../components/generic/CBB/Favorites/Players';
import { CircularProgress } from '@mui/material';
const api = new Api();

const Favorites = (props) => {
  const self = this;
  const router = useRouter();

  const [request, setRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [spin, setSpin] = useState(false);

  const season = (router.query && router.query.season) || new HelperCBB().getCurrentSeason();


  const getData = () => {;
    setRequest(true);
    setSpin(true);
    setLoading(true);

    api.Request({
      'class': 'favorite',
      'function': 'loadFavoriteData',
      'arguments': {
        'season': season,
      }
    }).then((favoriteData) => {
      setData(favoriteData);
      setSpin(false);
      setLoading(false);
    }).catch((err) => {
      // nothing for now
    });
  }

  if (!request) {
    getData();
  }

  return (
    <div style = {{'padding': '20px 20px 0px 20px'}}>
      <Head>
        <title>sRating | College basketball favorites</title>
        <meta name = 'description' content = 'My favorites' key = 'desc'/>
        <meta property="og:title" content=">sRating.io college basketball" />
        <meta property="og:description" content="My favorites" />
      </Head>
      <BackdropLoader open = {(spin === true)} />
      {
        loading ?
        <div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div> :
        <>
          <Teams favorite = {data && data.favorite} schedule = {data && data.schedule} teams = {data && data.teams} />
          <Players favorite = {data && data.favorite} gamelogs = {data && data.gamelog} players = {data && data.players} player_team_seasons = {data && data.player_team_seasons} />
        </>
      }
    </div>
  );
}



export default Favorites;
