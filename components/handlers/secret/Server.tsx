'use server';

import { useServerAPI } from '@/components/serverAPI';
import Client from './Client';
import { unstable_noStore } from 'next/cache';


const Server = async () => {
  unstable_noStore();

  const tag = 'refresher.secret';

  const secret = await useServerAPI({
    class: 'secret',
    function: 'find',
    arguments: {},
  }, { tags: [tag], revalidate: 60 });

  let error = false;
  let expires = Infinity;

  if (secret && secret.secret_id) {
    expires = new Date(secret.expires).getTime();

    // if you want to test locally, need to alter the time by the utc offset
    // expires -= (5 * 60 * 60 * 1000);
  } else {
    error = true;
  }


  return (
    <>
      <Client secret={secret.secret_id} tag = {tag} expires = {expires} error = {error} />
    </>
  );
};

export default Server;
