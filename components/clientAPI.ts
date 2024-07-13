'use client';

import { ClientConfig } from '@/types/config';

// this is just for the github build to pass, since the configuration file is git ignored
let config: ClientConfig = {
  host: 'localhost',
  port: 5000,
  http: 'http',
  use_origin: false,
  path: null,
  api_key: null,
  stripe_public_key: undefined,
};

try {
  const { clientConfig } = await import('../clientConfig.js');
  config = clientConfig;
} catch (e) {
  // dont care
}

const protocol = config.http;
const hostname = config.host;
const { port } = config;
const useOrigin = config.use_origin;
const path = config.path || '';
const apiKey = config.api_key;


export async function useClientAPI(args, optional_fetch_args = {}) {
  let url: string = `${protocol}://${hostname}:${port}`;
  if (useOrigin) {
    url = window.location.origin + path;
  }

  const session_id = (typeof window !== 'undefined' && localStorage.getItem('session_id')) || null;
  const secret = (typeof window !== 'undefined' && sessionStorage.getItem('secret')) || null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['X-API-KEY'] = apiKey;
  }

  if (session_id) {
    headers['X-SESSION-ID'] = session_id;
  }

  if (secret) {
    headers['X-SECRET-ID'] = secret;
  }

  return fetch(url, Object.assign(optional_fetch_args, {
    method: 'POST',
    headers,
    body: JSON.stringify(args),
  })).then((response) => response.json()).then((json) => json).catch((error) => {
    console.log(error);
    return {};
    // throw new Error('Error');
  });
}

