'use client';

import { useClientAPI } from '@/components/clientAPI';
import { setScheduleDifferentialsLoading, updateScheduleDifferentials } from '@/redux/features/team-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useState } from 'react';

const DifferentialLoader = ({ season, team_id }) => {
  const dispatch = useAppDispatch();
  
  const [loading, setLoading] = useState(false);
  const [lastSeason, setLastSeason] = useState(null);

  const getData = () => {
    if (loading) {
      return;
    }

    setLastSeason(season);
    setLoading(true);
    dispatch(setScheduleDifferentialsLoading(true));
    
    useClientAPI({
      'class': 'team',
      'function': 'getScheduleDifferentials',
      'arguments': {
        'season': season,
        'team_id': team_id,
      },
    }).then((response) => {
      dispatch(updateScheduleDifferentials(response));
      dispatch(setScheduleDifferentialsLoading(false));
      setLoading(false);
    }).catch((e) => {
      dispatch(setScheduleDifferentialsLoading(false));
      setLoading(false);
    });
  };
  
  if (lastSeason !== season) {
    getData();
  }

  return null;
};

export default DifferentialLoader;