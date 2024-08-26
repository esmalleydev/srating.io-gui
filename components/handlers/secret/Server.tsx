'use server';

import React from 'react';

import { useServerAPI } from '@/components/serverAPI';
import Client from './Client';
import { unstable_noStore } from 'next/cache';


const Server = async ({}) => {
  unstable_noStore();

  const tag = 'refresher.secret';

  const secret = await useServerAPI({
    class: 'secret',
    function: 'find',
    arguments: {},
  }, { tags: [tag], revalidate: 60 });

  return (
    <>
      <Client secret={secret} tag = {tag} />
    </>
  );
};

export default Server;
