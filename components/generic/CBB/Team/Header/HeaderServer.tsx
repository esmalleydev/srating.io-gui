'use server';
import React from 'react';

import HeaderClient from '@/components/generic/CBB/Team/Header/HeaderClient';
import Api from '@/components/Api.jsx';

const api = new Api();


const HeaderServer = async({season, team_id}) => {
  const revalidateSeconds = 60 * 60 * 2; // 2 hours
  interface Team {
    team_id: string;
    char6: string;
    code: string;
    name: string;
    alt_name: string;
    primary_color: string;
    secondary_color: string;
    cbb_d1: number;
    cbb: number;
    cfb: number;
    nba: number;
    nfl: number;
    nhl: number;
    guid: string;
    deleted: number;
    cbb_ranking: object;
    stats: {
      wins: number;
      losses: number;
    };
  };

  const team: Team = await api.Request({
    'class': 'team',
    'function': 'loadTeam',
    'arguments': {
      'team_id': team_id,
      'season': season,
    },
  }, {next: {revalidate: revalidateSeconds}});

  return (
    <>
      <HeaderClient team = {team} season = {season} />
    </>
  );
}

export default HeaderServer;
