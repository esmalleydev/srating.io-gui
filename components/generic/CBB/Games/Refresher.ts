'use client';

import { useClientAPI } from '@/components/clientAPI';
import { updateDateChecked, updateScores } from '@/redux/features/games-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect, useState } from 'react';

const Refresher = ({ date }) => {
  const refreshRate = 30;
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
        // 'cbb_game_id': visibleGames,
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
    return () => {
      clearInterval(intervalRefresher);
    };
  });

  return null;
};

export default Refresher;