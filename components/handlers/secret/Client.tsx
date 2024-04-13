'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoadingSecret, setSecret } from '@/redux/features/user-slice';
import { useIdleTimer } from 'react-idle-timer';
import { useEffect, useState } from 'react';
import { refresh } from '@/components/generic/CBB/actions';

let intervalRefresher: NodeJS.Timeout;

// todo handle, getting a secret that expires in 1 minute, this will not refresh until 9 mins? breaking all calls since it is invalid

const Client = ({ secret, tag }) => {
  const dispatch = useAppDispatch();
  const secret_id = useAppSelector(state => state.userReducer.secret_id);
  const [idle, setIdle] = useState<boolean>(false);

  const refreshRate = 60 * 10; // 10 mins
  // const refreshRate = 5;

  const onIdle = () => {
    setIdle(true);
  };

  const onActive = () => {
    if (idle) {
      refresh(tag);
      setIdle(false);
    }
  };

  useIdleTimer({
    onIdle,
    onActive,
    timeout: 1000 * 60 * 5, // 5 mins
    throttle: 500
  });

  useEffect(() => {
    intervalRefresher = setInterval(function() {
      dispatch(setLoadingSecret(true));
      refresh(tag).then(() => {
        dispatch(setLoadingSecret(false));
      });
    }, refreshRate * 1000);
    return function clean_up() {
      clearInterval(intervalRefresher);
    };
  });


  if (secret_id !== secret) {
    dispatch(setSecret(secret));
  }

  return null;
}

export default Client;
