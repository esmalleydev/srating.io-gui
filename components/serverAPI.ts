'use server';

import cacheData from 'memory-cache';
import { ServerConfig } from '@/types/config';


let config: ServerConfig = {
  host: 'localhost',
  port: 5000,
  http: 'http',
  secret: null,
};

try {
  const { serverConfig } = await import('../serverConfig.js');
  config = serverConfig;
} catch (e) {
  // dont care
}

const protocol = config.http;
const hostname = config.host;
const { port } = config;
const { secret } = config;

type OptionalFetchArgs = {
  revalidate: number;
  tags?: string[];
};

export async function useServerAPI(args, optional_fetch_args = {} as OptionalFetchArgs) {
  const request = JSON.stringify(args);

  const cachedLocation = `API.REQUESTS.${request}`;

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
    data = await fetch(`${protocol}://${hostname}:${port}`, {
      next: { revalidate: 0 },
      ...optional_fetch_args,
      method: 'POST',
      headers,
      body: request,
    }).then((response) => response.json()).then((json) => json).catch((error) => {
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
}



