
'use client';

import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useClientAPI } from '@/components/clientAPI';
import { useIdleTimer } from 'react-idle-timer';
import { setLoading as setDisplayLoading } from '@/redux/features/display-slice';
import { setSecret } from '@/redux/features/user-slice';

let intervalRefresher: NodeJS.Timeout;

const SecretHandler = () => {
  const dispatch = useAppDispatch();
  const secret_id = useAppSelector((state) => state.userReducer.secret_id);
  const [currentSecretID, setCurrentSecretID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [idle, setIdle] = useState<boolean>(false);

  const refreshRate = 60 * 10; // 10 mins
  // const refreshRate = 5;

  const onIdle = () => {
    setIdle(true);
  };

  const onActive = () => {
    if (idle) {
      setIdle(false);
    }
  };

  const getData = () => {
    if (loading) {
      return;
    }

    setLoading(true);
    // dispatch(setDisplayLoading(true));

    useClientAPI({
      class: 'secret',
      function: 'find',
      arguments: {},
    }).then((response) => {
      console.log(response)
      // setLoading(false);
      // setCurrentSecretID(response);
      // dispatch(setDisplayLoading(false));
      // dispatch(setSecret(response));
    }).catch((e) => {
      dispatch(setDisplayLoading(false));
      setLoading(false);
    });
  };

  useIdleTimer({
    onIdle,
    onActive,
    timeout: 1000 * 60 * 5, // 5 mins
    throttle: 500,
  });

  useEffect(() => {
    intervalRefresher = setInterval(() => {
      getData();
    }, refreshRate * 1000);
    return function clean_up() {
      clearInterval(intervalRefresher);
    };
  });

  if (currentSecretID === null || currentSecretID !== secret_id) {
    getData();
  }



  return null;
};

export default SecretHandler;
