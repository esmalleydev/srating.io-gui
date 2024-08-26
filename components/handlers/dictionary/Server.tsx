'use server';

import React from 'react';

import { useServerAPI } from '@/components/serverAPI';
import Client from './Client';
import { unstable_noStore } from 'next/cache';


const Server = async ({}) => {
  unstable_noStore();

  const seconds = 60 * 60 * 24; // cache for 24 hours

  const data = await useServerAPI({
    class: 'cbb',
    function: 'loadDictionary',
    arguments: {},
  }, { revalidate: seconds });

  return (
    <>
      <Client data = {data} />
    </>
  );
};

export default Server;
