'use client';

import { useClientAPI } from '@/components/clientAPI';
import { setDataKey } from '@/redux/features/team-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect, useState } from 'react';

const PredictionLoader = ({ organization_id, division_id, season, team_id }) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [lastSeason, setLastSeason] = useState(null);

  const getData = () => {
    if (loading) {
      return;
    }

    setLastSeason(season);
    setLoading(true);
    dispatch(setDataKey({ key: 'schedulePredictionsLoading', value: true }));

    useClientAPI({
      class: 'team',
      function: 'getSchedulePredictions',
      arguments: {
        organization_id,
        division_id,
        season,
        team_id,
      },
    }).then((response) => {
      dispatch(setDataKey({ key: 'schedulePredictions', value: response }));
      dispatch(setDataKey({ key: 'schedulePredictionsLoading', value: false }));
      setLoading(false);
    }).catch((e) => {
      dispatch(setDataKey({ key: 'schedulePredictionsLoading', value: false }));
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
