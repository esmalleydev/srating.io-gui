'use client';

import React from 'react';
import Typography from '@mui/material/Typography';
import CompareStatistic from '@/components/generic/CompareStatistic';
import { useAppSelector } from '@/redux/hooks';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';
import { getSections } from '@/components/generic/Game/Contents/Matchup/Client';


// todo for the conf recond compare, show their rank in the conference, not by total wins

type predictionsType = {
  away?: number;
  home?: number;
}

const CompareView = ({ statistic_rankings }) => {
  const predictions: predictionsType = useAppSelector((state) => state.compareReducer.predictions);
  const predictionsLoading = useAppSelector((state) => state.compareReducer.predictionsLoading);
  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const division_id = useAppSelector((state) => state.organizationReducer.division_id);
  const home_team_id = useAppSelector((state) => state.compareReducer.home_team_id);
  const away_team_id = useAppSelector((state) => state.compareReducer.away_team_id);
  const season = useAppSelector((state) => state.compareReducer.season);


  let awayStats = {};
  let homeStats = {};

  for (const statistic_ranking_id in statistic_rankings) {
    const row = statistic_rankings[statistic_ranking_id];
    if (row.team_id === away_team_id) {
      awayStats = row;
    }
    if (row.team_id === home_team_id) {
      homeStats = row;
    }
  }


  let numberOfTeams = CBB.getNumberOfD1Teams(season);

  if (organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id, season });
  }


  const predictionRows = [
    {
      name: 'Win %',
      title: 'Predicted win %',
      away: `${((predictions.away || 0) * 100).toFixed(0)}%`,
      home: `${((predictions.home || 0) * 100).toFixed(0)}%`,
      awayCompareValue: predictions.away,
      homeCompareValue: predictions.home,
      favored: 'higher',
      showDifference: false,
      locked: (!('away' in predictions) && !('home' in predictions)),
      loading: predictionsLoading,
    },
  ];


  const sections = getSections({ homeStats, awayStats });


  return (
    <div style = {{ padding: '0px 5px 20px 5px' }}>
      <CompareStatistic max = {numberOfTeams} season = {season} paper = {false} rows = {predictionRows} />

      {sections.map((section) => {
        return (
          <React.Fragment key = {section.name}>
            <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} variant = 'body1'>{section.name}</Typography>
            <CompareStatistic max = {numberOfTeams} season = {season} paper = {true} rows = {section.rows} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CompareView;
