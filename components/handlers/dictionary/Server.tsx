'use server';


import { useServerAPI } from '@/components/serverAPI';
import Client from './Client';


const Server = async () => {
  const seconds = 60 * 60 * 24; // cache for 24 hours

  const data = await useServerAPI({
    class: 'cbb',
    function: 'loadDictionary',
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
