'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Chip } from '@mui/material';
import { updateConferences } from '@/redux/features/display-slice';

export const getConferenceChips = () => {
  const dispatch = useAppDispatch();
  const selectedConferences = useAppSelector((state) => state.displayReducer.conferences);
  const conferences = useAppSelector((state) => state.dictionaryReducer.conference);

  const confChips: React.JSX.Element[] = [];
  for (let i = 0; i < selectedConferences.length; i++) {
    const conference = conferences[selectedConferences[i]];
    confChips.push(<Chip key = {selectedConferences[i]} sx = {{ margin: '5px' }} label={conference.code} onDelete={() => { dispatch(updateConferences(selectedConferences[i])); }} />);
  }

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
