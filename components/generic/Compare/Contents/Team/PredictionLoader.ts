'use client';

import { useClientAPI } from '@/components/clientAPI';
import { setDataKey } from '@/redux/features/compare-slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useState } from 'react';

const PredictionLoader = () => {
  const dispatch = useAppDispatch();

  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const division_id = useAppSelector((state) => state.organizationReducer.division_id);
  const season = useAppSelector((state) => state.compareReducer.season);
  const home_team_id = useAppSelector((state) => state.compareReducer.home_team_id);
  const away_team_id = useAppSelector((state) => state.compareReducer.away_team_id);
  const neutral_site = useAppSelector((state) => state.compareReducer.neutral_site);

  const [loading, setLoading] = useState(false);
  const [lastSeason, setLastSeason] = useState<number | null>(null);
  const [lastHomeTeamID, setLastHomeTeamID] = useState<string | null>(null);
  const [lastAwayTeamID, setLastAwayTeamID] = useState<string | null>(null);
  const [lastNeutralSite, setLastNeutralSite] = useState<boolean | number | null>(null);

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
    dispatch(setDataKey({ key: 'predictionsLoading', value: true }));

    useClientAPI({
      class: 'prediction',
      function: 'compare',
      arguments: {
        organization_id,
        division_id,
        season,
        home_team_id,
        away_team_id,
        neutral_site,
      },
    }).then((response) => {
      dispatch(setDataKey({ key: 'predictions', value: response }));
      dispatch(setDataKey({ key: 'predictionsLoading', value: false }));
      setLoading(false);
    }).catch((e) => {
      dispatch(setDataKey({ key: 'predictionsLoading', value: false }));
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
