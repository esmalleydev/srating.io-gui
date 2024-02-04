'use server';
import React from 'react';

import { useServerAPI } from '@/components/serverAPI';
import SecretClient from './SecretClient';
import { unstable_noStore } from 'next/cache';


const SecretHandler = async({}) => {
  unstable_noStore();

  const tag = 'refresher.secret';

  const secret = await useServerAPI({
    'class': 'secret',
    'function': 'find',
    'arguments': {},
  }, {tags: [tag], revalidate: 60});

  return (
    <>
      <SecretClient secret={secret} tag = {tag} />
    </>
  );
}

export default SecretHandler;
