'use client';

import { useClientAPI } from '@/components/clientAPI';
import { setRefreshCountdown, updateDateChecked, updateScores } from '@/redux/features/games-slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useState } from 'react';

const Refresher = ({ date }) => {
  const refreshRate = useAppSelector(state => state.gamesReducer.refreshRate);
  const dispatch = useAppDispatch();
  
  const [loading, setLoading] = useState(false);
  const [lastDate, setLastDate] = useState(null);

  const getData = () => {
    if (loading) {
      return;
    }

    setLastDate(date);
    setLoading(true);
    
    useClientAPI({
      'class': 'cbb_game',
      'function': 'getScores',
      'arguments': {
        'start_date': date,
      },
    }).then((response) => {
      dispatch(updateDateChecked(date));
      dispatch(updateScores(response));
      setLoading(false);
    }).catch((e) => {
      setLoading(false);
    });
  };
  
  if (lastDate !== date) {
    getData();
  }
  
  useEffect(() => {
    let intervalRefresher: NodeJS.Timeout = setInterval(function() {
      getData();
    }, refreshRate * 1000);

    const intervalRate = 500;
    let refreshCountdown = refreshRate;

    let intervalCountdown: NodeJS.Timeout = setInterval(function() {
      refreshCountdown = refreshCountdown - (intervalRate / 1000);
      dispatch(setRefreshCountdown(refreshCountdown));
    }, intervalRate);
    return () => {
      clearInterval(intervalRefresher);
      clearInterval(intervalCountdown);
    };
  });

  return null;
};

export default Refresher;