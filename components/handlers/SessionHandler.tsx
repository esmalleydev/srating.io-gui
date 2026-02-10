
'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useClientAPI } from '@/components/clientAPI';
import { reset, setDataKey } from '@/redux/features/user-slice';



const SessionHandler = () => {
  const dispatch = useAppDispatch();

  const storedKryptos = useAppSelector((state) => state.userReducer.kryptos);
  const session_id = useAppSelector((state) => state.userReducer.session_id);
  const validSession = useAppSelector((state) => state.userReducer.isValidSession);

  const [requestedSession, setRequestedSession] = useState(false);


  if (validSession === true && !session_id) {
    dispatch(setDataKey({ key: 'isValidSession', value: false }));
  }

  if (!requestedSession && session_id && storedKryptos) {
    setRequestedSession(true);
    useClientAPI({
      class: 'session',
      function: 'check',
      arguments: {
        session_id,
      },
    }).then((data) => {
      if (data && data.user && data.user.user_id) {
        dispatch(setDataKey({ key: 'isValidSession', value: true }));
        dispatch(setDataKey({ key: 'user', value: data.user }));
      } else {
        dispatch(setDataKey({ key: 'session_id', value: null }));
        dispatch(setDataKey({ key: 'user', value: null }));

        // todo test resetting, dont think i want to reset secret or kyptos though
        // dispatch(reset());
      }
    }).catch((e) => {
    });
  }

  const loginCallback = () => {
    sessionStorage.clear();
    dispatch(setDataKey({ key: 'isValidSession', value: true }));
  };


  return null;
};

export default SessionHandler;
