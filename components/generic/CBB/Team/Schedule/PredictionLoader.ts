'use client';

import { useClientAPI } from '@/components/clientAPI';
import { setSchedulePredictionsLoading, updateSchedulePredictions } from '@/redux/features/team-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect, useState } from 'react';

const PredictionLoader = ({ season, team_id }) => {
  const dispatch = useAppDispatch();
  
  const [loading, setLoading] = useState(false);
  const [lastSeason, setLastSeason] = useState(null);

  const getData = () => {
    if (loading) {
      return;
    }

    setLastSeason(season);
    setLoading(true);
    dispatch(setSchedulePredictionsLoading(true));
    
    useClientAPI({
      'class': 'team',
      'function': 'getSchedulePredictions',
      'arguments': {
        'season': season,
        'team_id': team_id,
      },
    }).then((response) => {
      dispatch(updateSchedulePredictions(response));
      dispatch(setSchedulePredictionsLoading(false));
      setLoading(false);
    }).catch((e) => {
      dispatch(setSchedulePredictionsLoading(false));
      setLoading(false);
    });
  };

  useEffect(() => {
    if (lastSeason !== season) {
      getData();
    }
  }, [season, lastSeason]);
  
  return null;
};

export default PredictionLoader;