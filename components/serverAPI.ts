'use server';

import cacheData from 'memory-cache';

type OptionalFetchArgs = {
  revalidate: number;
  tags?: string[];
};

const protocol = process.env.SERVER_PROTOCAL;
const hostname = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;
const secret = process.env.SERVER_SECRET;

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

  // if dev set cacheSeconds to 0, to not be so annoying
  if (process.env.SERVER_ENVIRONMENT === 'development') {
    cacheSeconds = 0;
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



