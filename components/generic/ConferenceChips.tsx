'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateConferences } from '@/redux/features/display-slice';
import Chip from '@/components/ux/container/Chip';
import { getStore } from '@/app/StoreProvider';

export const getConferenceChips = () => {
  // console.time('getConferenceChips')
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.displayReducer.conferences);
  const conferences = useAppSelector((state) => state.dictionaryReducer.conference);

  const handleClick = (value) => {
    const store = getStore();
    dispatch(updateConferences(value));
    const results = store.getState().displayReducer.conferences;

    const current = new URLSearchParams(window.location.search);

    if (results.length) {
      current.delete('conference_id');
      for (let i = 0; i < results.length; i++) {
        current.append('conference_id', results[i]);
      }
    } else {
      current.delete('conference_id');
    }

    window.history.replaceState(null, '', `?${current.toString()}`);

    // use pushState if we want to add to back button history
    // window.history.pushState(null, '', `?${current.toString()}`);


    // I dont think I need this?
    // const search = current.toString();
    // const query = search ? `?${search}` : '';

    // startTransition(() => {
    //   router.replace(`${pathName}${query}`);
    // });
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
