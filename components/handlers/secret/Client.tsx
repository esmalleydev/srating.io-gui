'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSecret } from '@/redux/features/user-slice';
import { useIdleTimer } from 'react-idle-timer';
import { useEffect, useState } from 'react';
import { refresh } from '@/components/generic/actions';
import { setLoading } from '@/redux/features/display-slice';
import { getTagLabel } from './shared';

let intervalRefresher: NodeJS.Timeout;

const Client = ({ secret, expires, error }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.displayReducer.loading);
  const secret_id = useAppSelector((state) => state.userReducer.secret_id);
  const [idle, setIdle] = useState<boolean>(false);

  const refreshRate = 60 * 10; // 10 mins
  const idleTimeoutMS = 1000 * 60 * 5; // 5 mins
  // const refreshRate = 5;
  // const idleTimeoutMS = 1000;


  const checkExpired = () => {
    return (expires < new Date().getTime());
  };

  const triggerRefresh = () => {
    dispatch(setLoading(true));
    refresh(getTagLabel());
  };

  const onIdle = () => {
    setIdle(true);
  };

  const onActive = () => {
    if (idle) {
      setIdle(false);
    }
  };

  useIdleTimer({
    onIdle,
    onActive,
    timeout: idleTimeoutMS,
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


