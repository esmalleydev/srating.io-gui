'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoadingSecret, setSecret } from '@/redux/features/user-slice';
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
  console.log('client')
  // console.log(secret)
  console.log(new Date(expires))
  console.log(new Date())



  const checkExpired = () => {
    return (expires < new Date().getTime());
  };

  const triggerRefresh = () => {
    console.log('do it')
    dispatch(setLoading(true));
    refresh(tag);
  };

  console.log(checkExpired())

  const onIdle = () => {
    console.log('idle')
    setIdle(true);
  };

  const onActive = async () => {
    if (idle) {
      console.log('active')
      setIdle(false);
    }
  };

  useIdleTimer({
    onIdle,
    onActive,
    // timeout: 1000 * 60 * 5, // 5 mins
    timeout: 1000 * 5, // 5 mins
    throttle: 500,
  });

  useEffect(() => {
    console.log('use effect')
    intervalRefresher = setInterval(async () => {
      console.log('interval')
      if (checkExpired() && !loading && !error) {
        triggerRefresh();
      }
    }, refreshRate * 1000);
    return function clean_up() {
      clearInterval(intervalRefresher);
    };
  });

  useEffect(() => {
    console.log('secondary use effect')
    if (checkExpired() && !loading && !error) {
      triggerRefresh();
    }

    if (secret_id !== secret) {
      console.log('set the secret')
      dispatch(setSecret(secret));
      dispatch(setLoading(false));
    }
  }, [secret, error, expires, idle]);


  return null;
};

export default Client;
