'use server';
import cacheData from 'memory-cache';
import { serverConfig } from '../serverConfig';
import { ServerConfig } from '@/types/config';


const config: ServerConfig = serverConfig || {
  'host': 'localhost',
  'port': 5000,
  'http': 'http',
  'secret': null,
};

const protocol = (config && config.http) || 'http';
const hostname = (config && config.host) || 'localhost';
const port = (config && config.port) || 5000;
const secret = (config && config.secret) || null;

type OptionalFetchArgs = {
  revalidate: number;
  tags?: string[];
};

export async function useServerAPI(args, optional_fetch_args = {} as OptionalFetchArgs) {
  const request = JSON.stringify(args);

  const cachedLocation = 'API.REQUESTS.' + request;

  let isCached = false;
  let cacheSeconds = 0;
  let cache = null;

  if (optional_fetch_args && 'revalidate' in optional_fetch_args) {
    cacheSeconds = optional_fetch_args.revalidate;
    cache = cacheData.get(cachedLocation);
  }

  if (cache !== null) {
    isCached = true;
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (secret) {
    headers['X-SECRET-ID'] = secret;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = {};

  if (isCached === false) {
    // console.log('MISS')
    data = await fetch(protocol + '://' + hostname + ':' + port, Object.assign(
      {
        next: {revalidate: 0}
      },
      optional_fetch_args,
      {
        'method': 'POST',
        'headers': headers,
        'body': request,
      }
    )).then(response => {
      return response.json();
    }).then(json => {
      return json;
    }).catch(error => {
      console.log(error);
      // throw new Error('Error');
    });

    if (cacheSeconds > 0) {
      cacheData.put(cachedLocation, data, 1000 * cacheSeconds);
    }
  } else {
    // console.log('HIT')
    data = cache || {};
  }

  return data;
};



