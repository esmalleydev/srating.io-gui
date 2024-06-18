'use client';
import React, { useState, useTransition } from 'react';

import Typography from '@mui/material/Typography';

// import FavoritePicker from '@/components/generic/FavoritePicker';
import HelperCBB from '@/components/helpers/CBB';
import { useAppSelector } from '@/redux/hooks';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import BackdropLoader from '@/components/generic/BackdropLoader';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import SeasonPicker from '@/components/generic/CBB/SeasonPicker';


const Client = ({cbb_conference_statistic_ranking, season, conference_id, seasons }) => {
  const conferences = useAppSelector(state => state.dictionaryReducer.conference);
  const cbb_statistic_rankings = useAppSelector(state => state.conferenceReducer.cbb_statistic_rankings);

  let totalWins = 0;
  let totalLosses = 0;

  for (let cbb_statistic_ranking_id in cbb_statistic_rankings) {
    const row = cbb_statistic_rankings[cbb_statistic_ranking_id];

    totalLosses += row.losses;
    totalWins += row.wins;
  }

  const conference = conferences[conference_id];
  
  const breakPoint = 475;
  
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  
  const { width } = useWindowDimensions() as Dimensions;
  
  const [isPending, startTransition] = useTransition();
  
  const [spin, setSpin] = useState(false);
  
  const CBB = new HelperCBB();

  const conferenceNumber = CBB.getNumberOfConferences();
  
  const bestColor = getBestColor();
  const worstColor = getWorstColor();


  const supStyle: React.CSSProperties = {
    'fontSize': (width < breakPoint ? '12px' : '16px'),
    'verticalAlign': 'super',
  };

  const rank = cbb_conference_statistic_ranking.adjusted_efficiency_rating_rank;

  if (rank) {
    supStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / conferenceNumber)));
  }

  const handleSeason = (season) => {
    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('season', season);
      const search = current.toString();
      const query = search ? `?${search}` : "";
      setSpin(true);
      startTransition(() => {
        router.push(`${pathName}${query}`);
        setSpin(false);
      });
    }
  };

  return (
    <div style = {{'overflow': 'hidden', 'paddingLeft': 5, 'paddingRight': 5}}>
      <div style = {{'display': 'flex', 'flexWrap': 'nowrap'}}>
        <Typography style = {{'whiteSpace': 'nowrap', 'textOverflow': 'ellipsis', 'overflow': 'hidden'}} variant = {(width < breakPoint ? 'h6' : 'h5')}>
          {rank ? <span style = {supStyle}>{rank} </span> : ''}
          {conference.name}
        </Typography>
        <SeasonPicker selected = {season} actionHandler = {handleSeason} seasons = {seasons} />
      </div>
      <div style = {{'display': 'flex', 'justifyContent': 'center'}}>
        <span style = {{'fontSize': '16px', 'verticalAlign': 'middle'}}>
          <Typography variant = 'overline' color = 'text.secondary'> ({totalWins}-{totalLosses})</Typography>
        </span>
      </div>
      <BackdropLoader open = {spin} />
    </div>
  );
}

export default Client;
