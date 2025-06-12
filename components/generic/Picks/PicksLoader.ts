'use client';

import { useClientAPI } from '@/components/clientAPI';
import { setPicksLoading, updatePicks } from '@/redux/features/picks-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect, useState } from 'react';


const PicksLoader = ({ organization_id, division_id, date }) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [lastDate, setLastDate] = useState(null);

  const getData = () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setLastDate(date);
    dispatch(setPicksLoading(true));

    useClientAPI({
      class: 'game',
      function: 'getScores',
      arguments: {
        organization_id,
        division_id,
        start_date: date,
      },
    }).then((response) => {
      dispatch(updatePicks(response));
      dispatch(setPicksLoading(false));
      setLoading(false);
    }).catch((e) => {
      dispatch(setPicksLoading(false));
      setLoading(false);
    });
  };


  useEffect(() => {
    if (lastDate !== date) {
      getData();
    }
  }, [organization_id, division_id, date]);

  return null;
};

export default PicksLoader;
