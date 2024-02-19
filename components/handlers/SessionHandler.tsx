
'use client';
import { useState} from "react";
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setSession, setValidSession } from "@/redux/features/user-slice";
import { useClientAPI } from "@/components/clientAPI";



const SessionHandler = () => {
  const dispatch = useAppDispatch();

  const session_id = useAppSelector(state => state.userReducer.session_id);
  const validSession = useAppSelector(state => state.userReducer.isValidSession)

  const [requestedSession, setRequestedSession] = useState(false);


  if (validSession === true && !session_id) {
    dispatch(setValidSession(false));
  }

  if (!requestedSession && session_id) {
    setRequestedSession(true);
    useClientAPI({
      'class': 'session',
      'function': 'check',
      'arguments': {
        'session_id': session_id,
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
