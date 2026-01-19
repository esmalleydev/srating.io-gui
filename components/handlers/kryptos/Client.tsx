'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setKryptos, setSecret } from '@/redux/features/user-slice';
import { useIdleTimer } from 'react-idle-timer';
import { useEffect, useState } from 'react';
import { useClientAPI } from '@/components/clientAPI';

let intervalRefresher: NodeJS.Timeout;


const Client = ({ kryptos, secret }) => {
  // console.log('kryptos client')
  const dispatch = useAppDispatch();

  const storedKryptos = useAppSelector((state) => state.userReducer.kryptos);
  const newUpdate = useAppSelector((state) => state.userReducer.newUpdate);
  const secret_id = useAppSelector((state) => state.userReducer.secret_id);
  const [idle, setIdle] = useState<boolean>(false);


  const refreshRate = 60 * 1; // 1 min
  const idleTimeoutMS = 1000 * 60 * 5; // 5 mins
  // const refreshRate = 5;
  // const idleTimeoutMS = 1000;

  const [requested, setRequested] = useState(false);
  const [triggeringIntervalRefresh, setTriggeringIntervalRefresh] = useState(false);
  const [expires, setExpires] = useState(null);

  const checkExpired = (expires: string) => {
    return (new Date(expires).getTime() < new Date().getTime());
  };

  const triggerRefresh = () => {
    setRequested(false);
  };

  const delayedRefresh = () => {
    setTimeout(() => {
      triggerRefresh();
    }, 4000);
  };

  const onIdle = () => {
    setIdle(true);
  };

  const onActive = () => {
    if (idle) {
      setIdle(false);
      triggerRefresh();
    }
  };

  useEffect(() => {
    dispatch(setKryptos(kryptos));
    dispatch(setSecret(secret ? secret.secret_id : null));
    setExpires(secret ? secret.expires : null);
  }, [kryptos, secret]);

  useIdleTimer({
    onIdle,
    onActive,
    timeout: idleTimeoutMS,
    throttle: 500,
  });

  useEffect(() => {
    intervalRefresher = setInterval(() => {
      if (
        (!expires || checkExpired(expires)) &&
        !triggeringIntervalRefresh
      ) {
        // console.log('expires use effect')
        setTriggeringIntervalRefresh(true);
        triggerRefresh();
      }
    }, refreshRate * 1000);
    return function clean_up() {
      clearInterval(intervalRefresher);
    };
  });


  if (!requested && !newUpdate && storedKryptos) {
    setRequested(true);
    useClientAPI({
      class: 'secret',
      function: 'find',
      arguments: {},
    }).then((newSecret) => {
      setTriggeringIntervalRefresh(false);
      // the current stored secret it old, try again
      if (secret_id && newSecret && newSecret.error && newSecret.code === 103) {
        dispatch(setSecret(null));
        triggerRefresh();
        return;
      }

      if (newSecret && newSecret.secret_id) {
        dispatch(setSecret(newSecret.secret_id));
        setExpires(newSecret.expires);
      } else if (newSecret && newSecret.error) {
        dispatch(setSecret(null));
        delayedRefresh();
      }
    }).catch((e) => {
      // try again in 4 seconds :/
      delayedRefresh();
    });
  }

  return null;
};

export default Client;


