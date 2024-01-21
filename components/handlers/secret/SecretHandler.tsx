'use server';
import React from 'react';

import { useServerAPI } from '@/components/serverAPI';
import SecretClient from './SecretClient';
import { unstable_noStore } from 'next/cache';


const SecretHandler = async({}) => {
  unstable_noStore();
  const revalidateSeconds = 1800; //60 * 30; // 30 mins

  const secret = await useServerAPI({
    'class': 'secret',
    'function': 'find',
    'arguments': {},
  }, {revalidate: revalidateSeconds});


  return (
    <>
      <SecretClient secret={secret} />
    </>
  );
}

export default SecretHandler;
