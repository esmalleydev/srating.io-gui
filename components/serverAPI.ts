'use server';


type OptionalFetchArgs = {
  tags?: string[];
};

const protocol = process.env.SERVER_PROTOCAL;
const hostname = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;
const secret = process.env.SERVER_SECRET;

export async function useServerAPI(args, optional_fetch_args = {} as OptionalFetchArgs) {
  const request = JSON.stringify(args);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (secret) {
    headers['X-SECRET-ID'] = secret;
  }


  // console.time(`useServerAPI.fetch.${args.class}:${args.function}()`);

  const results = await fetch(`${protocol}://${hostname}:${port}`, {
    next: { revalidate: 0 },
    cache: 'no-store',
    ...optional_fetch_args,
    method: 'POST',
    headers,
    body: request,
  })
    .then((response) => response.json())
    .then((json) => json)
    .catch((error) => {
      console.log(error);
      // throw new Error('Error');
    });

  // console.timeEnd(`useServerAPI.fetch.${args.class}:${args.function}()`);

  return results;
}



