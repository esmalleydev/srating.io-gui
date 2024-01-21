'use client';

import { useClientAPI } from '@/components/clientAPI';
import { updateDateChecked, updateScores } from '@/redux/features/games-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect, useState } from 'react';

let intervalRefresher: NodeJS.Timeout;

let date_ = null;

const Refresher = ({ date }) => {
  const refreshRate = 30;
  const dispatch = useAppDispatch();
  
  const [loading, setLoading] = useState(false);
  

  const getData = () => {
    if (loading) {
      return;
    }
    

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
  
  if (date_ !== date) {
    getData();
    date_ = date;
  }
  

  useEffect(() => {
    intervalRefresher = setInterval(function() {
      getData();
    }, refreshRate * 1000);
    return function clean_up() {
      clearInterval(intervalRefresher);
    };
  });


  return null;
};

export default Refresher;