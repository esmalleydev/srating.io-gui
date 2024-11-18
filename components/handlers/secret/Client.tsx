'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSecret } from '@/redux/features/user-slice';
import { useIdleTimer } from 'react-idle-timer';
import { useEffect, useState } from 'react';
import { refresh } from '@/components/generic/actions';
import { setLoading } from '@/redux/features/display-slice';

let intervalRefresher: NodeJS.Timeout;


const Client = ({ secret, tag, expires, error }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.displayReducer.loading);
  const secret_id = useAppSelector((state) => state.userReducer.secret_id);
  const [idle, setIdle] = useState<boolean>(false);

  const refreshRate = 60 * 10; // 10 mins
  // const refreshRate = 5;


  const checkExpired = () => {
    return (expires < new Date().getTime());
  };

  const triggerRefresh = () => {
    dispatch(setLoading(true));
    refresh(tag);
  };

  const onIdle = () => {
    setIdle(true);
  };

  const onActive = async () => {
    if (idle) {
      setIdle(false);
    }
  };

  useIdleTimer({
    onIdle,
    onActive,
    timeout: 1000 * 60 * 5, // 5 mins
    throttle: 500,
  });

  useEffect(() => {
    intervalRefresher = setInterval(async () => {
      if (checkExpired() && !loading && !error) {
        triggerRefresh();
      }
    }, refreshRate * 1000);
    return function clean_up() {
      clearInterval(intervalRefresher);
    };
  });

  useEffect(() => {
    if (checkExpired() && !loading && !error) {
      triggerRefresh();
    }

    if (secret_id !== secret) {
      dispatch(setSecret(secret));
      dispatch(setLoading(false));
    }
  }, [secret, error, expires, idle]);


  return null;
};

export default Client;
