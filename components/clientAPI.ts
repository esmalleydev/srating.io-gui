'use client';

// this is just for the github build to pass, since the configuration file is git ignored
type Config = {
  host: string;
  port: number;
  http: string;
  use_origin: boolean;
  path: string;
  api_key: string | null;
};

let config: Config | null = null;
try {
	config = require('../clientConfig');
} catch (e) {
	config = {
		'host': 'localhost',
	  'port': 5000,
	  'http': 'http',
    'use_origin': false,
    'path': '',
    'api_key': null,
	};
}

const protocol = (config && config.http) || 'http';
const hostname = (config && config.host) || 'localhost';
const port = (config && config.port) || 5000;
const useOrigin = (config && config.use_origin);
const path = (config && config.path) || '';
const apiKey = (config && config.api_key) || null;


export async function useClientAPI(args, optional_fetch_args = {}) {
  let url: string = protocol + '://' + hostname + ':' + port;
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
    'method': 'POST',
    'headers': headers,
    'body': JSON.stringify(args),
  })).then(response => {
    return response.json();
  }).then(json => {
    return json;
  }).catch(error => {
    console.log(error);
    return {};
    // throw new Error('Error');
  });
};

