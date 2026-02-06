'use client';

import { useClientAPI } from '@/components/clientAPI';
import { setDataKey } from '@/redux/features/ranking-slice';
import { setDataKey as setCacheDataKey } from '@/redux/features/cache-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect, useState } from 'react';
import { getStore } from '@/app/StoreProvider';
import Objector from '@/components/utils/Objector';

export const getCachedDataKey = ({ organization_id, division_id, season, view }) => {
  return `${organization_id}${division_id}${season}${view}_ranking_data`;
};

const Loader = ({ organization_id, division_id, season, view }) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [lastSeason, setLastSeason] = useState(null);
  const [lastView, setLastView] = useState(null);
  const [lastOrganization, setLastOrganization] = useState(null);
  const [lastDivision, setLastDivision] = useState(null);

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
    function: 'load',
    arguments: {
      organization_id,
      division_id,
      season,
      fxn,
    },
    cache: seconds,
  };

  const getData = () => {
    if (loading) {
      return;
    }

    setLastSeason(season);
    setLastView(view);
    setLastOrganization(organization_id);
    setLastDivision(division_id);

    const store = getStore();

    const one_hour_ms = 60 * 60 * 1000;
    const requestTime = new Date().getTime();
    const cachedDataKey = getCachedDataKey({ organization_id, division_id, season, view });

    const { rankingData } = store.getState().cacheReducer;

    if (
      rankingData &&
      cachedDataKey in rankingData &&
      'timer' in rankingData[cachedDataKey] &&
      'data' in rankingData[cachedDataKey]
    ) {
      const { data, timer } = rankingData[cachedDataKey];
      const timerValue = +(timer || Infinity);
      if ((+requestTime - timerValue) < one_hour_ms) {
        if (data) {
          dispatch(setDataKey({ key: 'data', value: data }));
          return;
        }
      }
    }


    setLoading(true);
    dispatch(setDataKey({ key: 'loadingView', value: true }));

    useClientAPI(dataArgs)
      .then((response) => {
        let data = response;
        if (data.error) {
          data = {};
        }
        const store = getStore();
        const rankingData = Objector.deepClone(store.getState().cacheReducer.rankingData);
        delete rankingData[cachedDataKey];
        rankingData[cachedDataKey] = { timer: requestTime, data: response };

        dispatch(setCacheDataKey({ key: 'rankingData', value: rankingData }));
        dispatch(setDataKey({ key: 'data', value: response }));
        dispatch(setDataKey({ key: 'loadingView', value: false }));
        setLoading(false);
      }).catch((e) => {
        dispatch(setDataKey({ key: 'loadingView', value: false }));
        setLoading(false);
      });
  };

  useEffect(() => {
    if (
      lastSeason !== season ||
      lastView !== view ||
      lastOrganization !== organization_id ||
      lastDivision !== division_id
    ) {
      getData();
    }
  }, [view, season, organization_id, division_id]);

  return null;
};

export default Loader;
