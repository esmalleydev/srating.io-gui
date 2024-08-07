'use client';

import React, { useTransition } from 'react';

import Typography from '@mui/material/Typography';

// import FavoritePicker from '@/components/generic/FavoritePicker';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import SeasonPicker from '@/components/generic/CBB/SeasonPicker';
import { setLoading } from '@/redux/features/display-slice';
import Rank from './Rank';
import { getBreakPoint } from './ClientWrapper';
import Record from './Record';


const Client = ({ cbb_conference_statistic_ranking, season, conference_id, seasons }) => {
  const dispatch = useAppDispatch();
  const conferences = useAppSelector((state) => state.dictionaryReducer.conference);

  const conference = conferences[conference_id];

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const { width } = useWindowDimensions() as Dimensions;

  const [isPending, startTransition] = useTransition();


  const handleSeason = (season) => {
    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('season', season);
      const search = current.toString();
      const query = search ? `?${search}` : '';
      dispatch(setLoading(true));
      startTransition(() => {
        router.push(`${pathName}${query}`);
      });
    }
  };

  return (
    <div style = {{ overflow: 'hidden', paddingLeft: 5, paddingRight: 5 }}>
      <div style = {{ display: 'flex', flexWrap: 'nowrap' }}>
        <Typography style = {{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} variant = {(width < getBreakPoint() ? 'h6' : 'h5')}>
          <Rank cbb_conference_statistic_ranking={cbb_conference_statistic_ranking} />
          {conference.name}
        </Typography>
        <SeasonPicker selected = {season} actionHandler = {handleSeason} seasons = {seasons} />
      </div>
      <div style = {{ display: 'flex', justifyContent: 'center' }}>
        <span style = {{ fontSize: '16px', verticalAlign: 'middle' }}>
          <Record />
        </span>
      </div>
    </div>
  );
};

export default Client;
