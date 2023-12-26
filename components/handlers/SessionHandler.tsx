
'use client';
import React, { useRef, useState} from "react";

import { useAppSelector, useAppDispatch } from '@/redux/hooks';

import Api from "@/components/Api";
import { setSession, setValidSession } from "@/redux/features/user-slice";

const api = new Api();


const SessionHandler = () => {
  const dispatch = useAppDispatch();
  const userSlice = useAppSelector(state => state.userReducer.value);

  const session_id = userSlice.session_id;
  const validSession = userSlice.isValidSession;

  // const [validSession, setValidSession] = useState(false);
  const [requestedSession, setRequestedSession] = useState(false);


  if (validSession === true && !session_id) {
    // setValidSession(false);
    dispatch(setValidSession(false));
  }

  if (!requestedSession && session_id) {
    setRequestedSession(true);
    api.Request({
      'class': 'session',
      'function': 'check',
      'arguments': {
        'session_id': session_id
      },
    }).then((valid) => {
      if (valid) {
        dispatch(setValidSession(true));
      } else {
        localStorage.removeItem('session_id');
        dispatch(setSession(null));
      }
    }).catch((e) => {
    });
  }

  const loginCallback = () => {
    sessionStorage.clear();
    dispatch(setValidSession(true));
  };


  return null;
};

export default SessionHandler;
