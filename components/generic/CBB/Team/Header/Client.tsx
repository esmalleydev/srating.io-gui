'use client';

import React, { useTransition } from 'react';

import Typography from '@mui/material/Typography';

import FavoritePicker from '@/components/generic/FavoritePicker';
import HelperCBB from '@/components/helpers/CBB';
import HelperTeam from '@/components/helpers/Team';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import SeasonPicker from '@/components/generic/CBB/SeasonPicker';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { Link, Skeleton } from '@mui/material';
import { setLoading } from '@/redux/features/display-slice';


/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ overflow: 'hidden', paddingLeft: 5, paddingRight: 5 }}>
      {children}
    </div>
  );
};


/**
 * The first line, containing the team name + buttons
 */
const PrimaryLine = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ display: 'flex', flexWrap: 'nowrap' }}>
      {children}
    </div>
  );
};


/**
 * The second line, containing the conference + coach
 */
const SecondaryLine = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ display: 'flex', justifyContent: 'center' }}>
      {children}
    </div>
  );
};

const ClientSkeleton = () => {
  return (
    <Contents>
      <PrimaryLine>
        <Skeleton width={320} height={30} style={{ marginBottom: 5 }} />
      </PrimaryLine>
      <SecondaryLine>
        <Skeleton width={200} height={28} />
      </SecondaryLine>
    </Contents>
  );
};

const Client = ({
  team, season, seasons, coach, coach_statistic_ranking, conference_statistic_ranking,
}) => {
  const breakPoint = 475;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const { width } = useWindowDimensions() as Dimensions;
  const [isPending, startTransition] = useTransition();

  const displayRank = useAppSelector((state) => state.displayReducer.rank);

  const CBB = new HelperCBB();
  const teamHelper = new HelperTeam({ team });

  const conferenceName = teamHelper.getConference();
  const conferenceNumber = CBB.getNumberOfConferences();

  const bestColor = getBestColor();
  const worstColor = getWorstColor();


  const supStyle: React.CSSProperties = {
    fontSize: (width < breakPoint ? '12px' : '16px'),
    verticalAlign: 'super',
  };

  const coachSupStyle: React.CSSProperties = {
    fontSize: '10px',
    verticalAlign: 'super',
  };

  const conferenceSupStyle: React.CSSProperties = {
    fontSize: '10px',
    verticalAlign: 'super',
  };

  const rank = teamHelper.getRank(displayRank);
  const coachRank = coach_statistic_ranking ? coach_statistic_ranking.rank : null;
  const conferenceRank = conference_statistic_ranking.adjusted_efficiency_rating_rank;

  if (rank) {
    supStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / CBB.getNumberOfD1Teams(season))));
  }

  if (coachRank) {
    coachSupStyle.color = Color.lerpColor(bestColor, worstColor, (+(coachRank / CBB.getNumberOfD1Teams(season))));
  }

  if (conferenceRank) {
    conferenceSupStyle.color = Color.lerpColor(bestColor, worstColor, (+(conferenceRank / conferenceNumber)));
  }

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

  const handleCoach = () => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/cbb/coach/${coach.coach_id}`/* +'?season='+season */);
    });
  };

  const handleConference = () => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/cbb/conference/${team.conference_id}?season=${season}`);
    });
  };

  return (
    <Contents>
      <PrimaryLine>
        <Typography style = {{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} variant = {(width < breakPoint ? 'h6' : 'h5')}>
          {rank ? <span style = {supStyle}>{rank} </span> : ''}
          {teamHelper.getName()}
          <span style = {{ fontSize: '16px', verticalAlign: 'middle' }}>
            <Typography variant = 'overline' color = 'text.secondary'> ({team?.stats.wins || 0}-{team?.stats.losses || 0})</Typography>
          </span>
        </Typography>
        <FavoritePicker team_id = {team?.team_id} />
        <SeasonPicker selected = {season} actionHandler = {handleSeason} seasons = {seasons} />
      </PrimaryLine>
      <SecondaryLine>
        <Typography variant = 'overline' color = 'text.secondary'>{conferenceRank ? <span style = {conferenceSupStyle}>{conferenceRank} </span> : ''}<Link onClick = {handleConference} underline='hover' style={{ cursor: 'pointer' }}>{conferenceName}</Link> | {coachRank ? <span style = {coachSupStyle}>{coachRank} </span> : ''}{coach ? <Link onClick = {handleCoach} underline='hover' style={{ cursor: 'pointer' }}>{`${coach.first_name.charAt(0)}. ${coach.last_name}`}</Link> : 'UNKNOWN'}</Typography>
      </SecondaryLine>
    </Contents>
  );
};

export { Client, ClientSkeleton };
