'use server';

import { useServerAPI } from '@/components/serverAPI';
import Client from './Client';
import { getTagLabel } from './shared';


const Server = async () => {
  const tag = getTagLabel();

  const secret = await useServerAPI({
    class: 'secret',
    function: 'find',
    arguments: {},
    cache: 60,
  }, { tags: [tag] });

  let error = false;
  let expires = Infinity;

  if (secret && secret.secret_id) {
    expires = new Date(secret.expires).getTime();

    // if you want to test locally, need to alter the time by the utc offset
    if (process.env.NEXT_PUBLIC_ENV === 'dev') {
      // expires -= (5 * 60 * 60 * 1000);
    }
  } else {
    error = true;
  }


  return (
    <>
      <Client secret={secret?.secret_id} expires = {expires} error = {error} />
    </>
  );
};

export default Server;
