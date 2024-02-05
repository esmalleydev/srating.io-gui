'use client';

import { useClientAPI } from '@/components/clientAPI';
import { setRefreshCountdown, setRefreshEnabled, setRefreshLoading, updateDateChecked, updateScores } from '@/redux/features/games-slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useState } from 'react';

const Refresher = ({ date, cbb_games }) => {
  const refreshRate = useAppSelector(state => state.gamesReducer.refreshRate);
  const dispatch = useAppDispatch();
  
  const [loading, setLoading] = useState(false);
  const [lastDate, setLastDate] = useState(null);

  let finalCount = 0;
  let total = 0;
  for (let cbb_game_id in cbb_games) {
    const cbb_game = cbb_games[cbb_game_id];

    if (cbb_game.status === 'final') {
      finalCount++;
    }

    total++;
  }

  const isFinal = (total === finalCount);

  const getData = () => {
    if (loading) {
      return;
    }

    setLastDate(date);
    setLoading(true);
    dispatch(setRefreshLoading(true));
    
    useClientAPI({
      'class': 'cbb_game',
      'function': 'getScores',
      'arguments': {
        'start_date': date,
      },
    }).then((response) => {
      dispatch(updateDateChecked(date));
      dispatch(updateScores(response));
      dispatch(setRefreshLoading(false));
      dispatch(setRefreshEnabled(!isFinal));
      setLoading(false);
    }).catch((e) => {
      dispatch(setRefreshLoading(false));
      setLoading(false);
    });
  };
  
  if (lastDate !== date) {
    getData();
  }
  
  useEffect(() => {
    let intervalRefresher: NodeJS.Timeout;
    let intervalCountdown: NodeJS.Timeout;

    if (!isFinal) {
      intervalRefresher = setInterval(function() {
        getData();
      }, refreshRate * 1000);

      const intervalRate = 100;
      let refreshCountdown = refreshRate;

      intervalCountdown = setInterval(function() {
        refreshCountdown = refreshCountdown - (intervalRate / 1000);
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