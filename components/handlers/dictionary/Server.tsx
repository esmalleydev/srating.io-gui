'use server';


import { useServerAPI } from '@/components/serverAPI';
import Client from './Client';


const Server = async () => {
  const seconds = 60 * 60 * 24; // cache for 24 hours

  const data = await useServerAPI({
    class: 'dictionary',
    function: 'load',
    arguments: {},
    cache: seconds,
  });

  return (
    <>
      <Client data = {data} />
    </>
  );
};

export default Server;
