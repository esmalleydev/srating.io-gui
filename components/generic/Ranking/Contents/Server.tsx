'use server';

import cacheData from 'memory-cache';

import { Client } from '@/components/generic/Ranking/Contents/Client';
import { getCachedLocation, useServerAPI } from '@/components/serverAPI';
import { unstable_noStore } from 'next/cache';
import DataHandler from '../DataHandler';
import Organization from '@/components/helpers/Organization';
import { TransferPlayerSeasons } from '@/types/cbb';
import { Teams, TeamSeasonConferences } from '@/types/general';


const Server = async ({ organization_id, division_id, season, view }) => {
  unstable_noStore();
  const seconds = 60 * 60 * 5; // cache for 5 hours

  let fxn = 'getTeamRanking';
  if (view === 'player' || view === 'transfer') {
    fxn = 'getPlayerRanking';
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
      season,
    },
  };

  if (fxn === 'getTeamRanking') {
    const cache = await useServerAPI({
      class: 'cache',
      function: 'get',
      arguments: {
        key: 'getTeamRanking',
        refresh: 1,
      },
    });

    if (cache && cache.cache_id) {
      cacheData.del(getCachedLocation(dataArgs));
      await useServerAPI({
        class: 'cache',
        function: 'update',
        arguments: {
          cache_id: cache.cache_id,
          refresh: 0,
        },
      });
    }
  }

  let data = await useServerAPI(dataArgs, { revalidate: seconds });

  if (Organization.getCBBID() === organization_id && view === 'transfer') {
    data = { ...data };
    const cbb_transfer_player_seasons: TransferPlayerSeasons = await useServerAPI({
      class: 'cbb_transfer_player_season',
      function: 'read',
      arguments: {
        season,
      },
    });


    const team_season_conferences: TeamSeasonConferences = await useServerAPI({
      class: 'team_season_conference',
      function: 'read',
      arguments: {
        season,
        organization_id,
        division_id,
      },
    });

    const teams: Teams = await useServerAPI({
      class: 'team',
      function: 'read',
      arguments: {
        team_id: Object.values(team_season_conferences).map(((row) => row.team_id)),
      },
    });

    const team_id_x_team_season_conference_id = {};
    for (const team_season_conference_id in team_season_conferences) {
      const row = team_season_conferences[team_season_conference_id];
      team_id_x_team_season_conference_id[row.team_id] = team_season_conference_id;
    }

    const player_id_x_cbb_transfer_player_season = {};
    for (const cbb_transfer_player_season_id in cbb_transfer_player_seasons) {
      player_id_x_cbb_transfer_player_season[cbb_transfer_player_seasons[cbb_transfer_player_season_id].player_id] = cbb_transfer_player_seasons[cbb_transfer_player_season_id];
    }

    for (const id in data) {
      if (
        !data[id].player_id ||
        !(data[id].player_id in player_id_x_cbb_transfer_player_season)
      ) {
        delete data[id];
      } else {
        data[id].committed = player_id_x_cbb_transfer_player_season[data[id].player_id].committed;
        data[id].committed_team_id = player_id_x_cbb_transfer_player_season[data[id].player_id].committed_team_id;
        data[id].committed_team_name = (data[id].committed_team_id in teams ? teams[data[id].committed_team_id].alt_name : '-');
        data[id].committed_conference_id = (
          data[id].committed_team_id && data[id].committed_team_id in team_id_x_team_season_conference_id ?
            team_season_conferences[team_id_x_team_season_conference_id[data[id].committed_team_id]].conference_id :
            null
        );
      }
    }
  }

  const generated = new Date().getTime();

  return (
    <>
      <DataHandler data = {data} />
      <Client generated = {generated} organization_id = {organization_id} division_id = {division_id} season = {season} view = {view} />
    </>
  );
};

export default Server;
