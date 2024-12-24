'use client';

import { useClientAPI } from '@/components/clientAPI';
import {
  setRefreshCountdown, setRefreshEnabled, setRefreshLoading, updateDateChecked, updateScores,
} from '@/redux/features/games-slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useState } from 'react';

const Refresher = ({ date, games }) => {
  const refreshEnabled = useAppSelector((state) => state.gamesReducer.refreshEnabled);
  const refreshRate = useAppSelector((state) => state.gamesReducer.refreshRate);
  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const division_id = useAppSelector((state) => state.organizationReducer.division_id);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [lastDate, setLastDate] = useState(null);

  let finalCount = 0;
  let total = 0;
  for (const game_id in games) {
    const game = games[game_id];

    if (game.status === 'final') {
      finalCount++;
    }

    total++;
  }

  const isFinal = (total === finalCount);

  let failures = 0;

  const getData = () => {
    if (loading) {
      return;
    }

    if (failures > 10) {
      return;
    }

    setLastDate(date);
    setLoading(true);
    dispatch(setRefreshLoading(true));

    useClientAPI({
      class: 'game',
      function: 'getScores',
      arguments: {
        organization_id,
        division_id,
        start_date: date,
      },
    }).then((response) => {
      if (response && !response.error) {
        failures = 0;
        dispatch(updateDateChecked(date));
        dispatch(updateScores(response));
      }
      dispatch(setRefreshLoading(false));
      dispatch(setRefreshEnabled(!isFinal));
      setLoading(false);

      // so if the response failed, because secret is still refreshing, try this again in 1 second
      if (response && response.error && response.code && response.code === 103) {
        failures++;
        setTimeout(getData, 1000);
      }
    }).catch((e) => {
      dispatch(setRefreshLoading(false));
      setLoading(false);
    });
  };


  useEffect(() => {
    if (lastDate !== date) {
      getData();
    }

    let intervalRefresher: NodeJS.Timeout;
    let intervalCountdown: NodeJS.Timeout;

    if (!isFinal && refreshEnabled) {
      intervalRefresher = setInterval(() => {
        getData();
      }, refreshRate * 1000);

      const intervalRate = 100;
      let refreshCountdown = refreshRate;

      intervalCountdown = setInterval(() => {
        refreshCountdown -= (intervalRate / 1000);
        dispatch(setRefreshCountdown(refreshCountdown));
      }, intervalRate);
    }
    return () => {
      if (intervalRefresher) {
        clearInterval(intervalRefresher);
      }

      if (intervalCountdown) {
        clearInterval(intervalCountdown);
      }
    };
  });

  return null;
};

export default Refresher;
