'use client';

import { getStore } from '@/app/StoreProvider';
import { setNewUpdate } from '@/redux/features/user-slice';

const protocol = process.env.NEXT_PUBLIC_CLIENT_PROTOCAL;
const hostname = process.env.NEXT_PUBLIC_CLIENT_HOST;
const port = +(process.env.NEXT_PUBLIC_CLIENT_PORT || 4000);
const useOrigin = (typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_CLIENT_USE_ORIGIN === 'true') : false);
const path = process.env.NEXT_PUBLIC_CLIENT_PATH || '';

export async function useClientAPI(args, optional_fetch_args = {}) {
  let url: string = `${protocol}://${hostname}:${port}`;
  if (useOrigin) {
    url = window.location.origin + path;
  }

  const session_id = (typeof window !== 'undefined' && localStorage.getItem('session_id')) || null;
  const secret = (typeof window !== 'undefined' && sessionStorage.getItem('secret')) || null;
  const kryptos = (typeof window !== 'undefined' && sessionStorage.getItem('kryptos')) || null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // if (apiKey) {
  //   headers['X-API-KEY'] = apiKey;
  // }

  if (session_id) {
    headers['X-SESSION-ID'] = session_id;
  }

  if (secret) {
    headers['X-SECRET-ID'] = secret;
  }

  if (kryptos) {
    headers['X-KRYPTOS-ID'] = kryptos;
  }

  return fetch(url, Object.assign(optional_fetch_args, {
    method: 'POST',
    headers,
    body: JSON.stringify(args),
  }))
    .then((response) => response.json())
    .then((json) => {
      // new update available
      if (json && json.error && json.code === 105) {
        const store = getStore();
        store.dispatch(setNewUpdate(true));
      }

      // secret expired
      if (json && json.error && json.code === 103) {
        // todo trigger refresh?
      }

      return json;
    })
    .catch((error) => {
      console.log(error);
      return {};
      // throw new Error('Error');
    });
}

