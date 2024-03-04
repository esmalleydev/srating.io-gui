'use client';

import { useClientAPI } from '@/components/clientAPI';
import { setPredictions, setPredictionsLoading } from '@/redux/features/compare-slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useState } from 'react';

const PredictionLoader = ({ season }) => {
  const dispatch = useAppDispatch();

  const home_team_id = useAppSelector(state => state.compareReducer.home_team_id);
  const away_team_id = useAppSelector(state => state.compareReducer.away_team_id);
  const neutral_site = useAppSelector(state => state.compareReducer.neutral_site);
  
  const [loading, setLoading] = useState(false);
  const [lastSeason, setLastSeason] = useState(null);
  const [lastHomeTeamID, setLastHomeTeamID] = useState<string | null>(null);
  const [lastAwayTeamID, setLastAwayTeamID] = useState<string | null>(null);
  const [lastNeutralSite, setLastNeutralSite] = useState<number | null>(null);

  const getData = () => {
    if (loading) {
      return;
    }

    if (!home_team_id || !away_team_id) {
      return;
    }

    setLastSeason(season);
    setLastHomeTeamID(home_team_id);
    setLastAwayTeamID(away_team_id);
    setLastNeutralSite(neutral_site);
    setLoading(true);
    dispatch(setPredictionsLoading(true));
    
    useClientAPI({
      'class': 'cbb',
      'function': 'compareTeamsPrediction',
      'arguments': {
        'season': season,
        'home_team_id': home_team_id,
        'away_team_id': away_team_id,
        'neutral_site': neutral_site,
      },
    }).then((response) => {
      dispatch(setPredictions(response));
      dispatch(setPredictionsLoading(false));
      setLoading(false);
    }).catch((e) => {
      dispatch(setPredictionsLoading(false));
      setLoading(false);
    });
  };
  
  if (
    lastSeason !== season ||
    lastHomeTeamID !== home_team_id ||
    lastAwayTeamID !== away_team_id ||
    lastNeutralSite !== neutral_site
  ) {
    getData();
  }

  return null;
};

export default PredictionLoader;