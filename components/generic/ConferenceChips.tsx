'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Chip from '@/components/ux/container/Chip';
import { updateDataKey } from '@/redux/features/display-slice';

export const getConferenceChips = () => {
  // console.time('getConferenceChips')
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.displayReducer.conferences);
  const conferences = useAppSelector((state) => state.dictionaryReducer.conference);

  const handleClick = (value: string) => {
    dispatch(updateDataKey({ key: 'conferences', value }));
  };

  const confChips: React.JSX.Element[] = [];
  for (let i = 0; i < selected.length; i++) {
    const conference = conferences[selected[i]];
    let label = conference.code;
    if (conference.code.toLowerCase() === conference.name.toLowerCase()) {
      label = conference.name;
    }
    confChips.push(<Chip key = {selected[i]} style = {{ margin: '5px' }} title={label} value = {selected[i]} onDelete={() => handleClick(selected[i])} />);
  }

  // console.timeEnd('getConferenceChips')

  return confChips;
};

const ConferenceChips = () => {
  const confChips = getConferenceChips();
  return (
    <>
      {confChips}
    </>
  );
};

export default ConferenceChips;
