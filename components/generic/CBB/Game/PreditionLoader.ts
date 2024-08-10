'use client';

import { useClientAPI } from '@/components/clientAPI';
import { setDataKey } from '@/redux/features/game-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect, useState } from 'react';


const PredictionLoader = ({ cbb_game_id }) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [lastID, setLastID] = useState(null);

  const getData = () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setLastID(cbb_game_id);
    dispatch(setDataKey({ key: 'gamePredictionLoading', value: true }));

    useClientAPI({
      class: 'cbb_game',
      function: 'getScores',
      arguments: {
        cbb_game_id,
      },
    }).then((response) => {
      dispatch(setDataKey({ key: 'gamePrediction', value: response }));
      dispatch(setDataKey({ key: 'gamePredictionLoading', value: false }));
      setLoading(false);
    }).catch((e) => {
      dispatch(setDataKey({ key: 'gamePredictionLoading', value: false }));
      setLoading(false);
    });
  };


  useEffect(() => {
    if (lastID !== cbb_game_id) {
      getData();
    }
  }, [cbb_game_id]);

  return null;
};

export default PredictionLoader;
