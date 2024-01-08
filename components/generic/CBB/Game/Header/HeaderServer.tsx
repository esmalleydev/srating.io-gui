'use server';
import React from 'react';

import HeaderClient from '@/components/generic/CBB/Game/Header/HeaderClient';
import Api from '@/components/Api.jsx';

const api = new Api();

const HeaderServer = async({cbb_game_id}) => {
  const tag = 'cbb.games.'+ cbb_game_id;

  const cbb_game = await api.Request({
    'class': 'cbb_game',
    'function': 'get',
    'arguments': {
      'cbb_game_id': cbb_game_id,
    },
  }, {next: {tags: [tag], revalidate: 30}});

  return (
    <>
      <HeaderClient cbb_game = {cbb_game} tag = {tag} />
    </>
  );
}

export default HeaderServer;
