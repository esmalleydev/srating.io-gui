'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSecret } from '@/redux/features/user-slice';
import { useEffect } from 'react';
import { refresh } from '@/components/generic/CBB/actions';

let intervalRefresher: NodeJS.Timeout;

const SecretClient = ({ secret, tag }) => {
  const dispatch = useAppDispatch();
  const secret_id = useAppSelector(state => state.userReducer.secret_id);

  const refreshRate = 60 * 10; // 10 mins

  useEffect(() => {
    intervalRefresher = setInterval(function() {
      refresh(tag);
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

export default SecretClient;
