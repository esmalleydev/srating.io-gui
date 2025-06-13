'use server';

import { Client } from '@/components/generic/Ranking/Contents/Client';
import { useServerAPI } from '@/components/serverAPI';
import DataHandler from '../DataHandler';

const Server = async ({ organization_id, division_id, season, view }) => {
  const seconds = 60 * 60; // cache for 1 hours

  let fxn = 'getTeamRanking';
  if (view === 'player') {
    fxn = 'getPlayerRanking';
  } else if (view === 'transfer') {
    fxn = 'getTransferRanking';
  } else if (view === 'conference') {
    fxn = 'getConferenceRanking';
  } else if (view === 'coach') {
    fxn = 'getCoachRanking';
  }

  const dataArgs = {
    class: 'ranking',
    function: fxn,
    arguments: {
      organization_id,
      division_id,
      season: season.toString(),
    },
  };

  const cacheArgs = {
    class: 'cache',
    function: 'handle',
    arguments: {
      class: dataArgs.class,
      function: dataArgs.function,
      arguments: dataArgs.arguments,
    },
    cache: seconds,
  };


  const data = await useServerAPI(cacheArgs);

  const generated = new Date().getTime();

  return (
    <>
      <DataHandler data = {data} />
      <Client generated = {generated} organization_id = {organization_id} division_id = {division_id} season = {season} view = {view} />
    </>
  );
};

export default Server;
