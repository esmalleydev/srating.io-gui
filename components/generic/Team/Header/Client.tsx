'use client';

import { useTransition } from 'react';

import FavoritePicker from '@/components/generic/FavoritePicker';
import HelperTeam from '@/components/helpers/Team';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import OptionPicker from '@/components/generic/OptionPicker';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { Skeleton } from '@mui/material';
import { setLoading } from '@/redux/features/display-slice';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';
import { Coach, CoachStatisticRanking, Team } from '@/types/general';
import { ConferenceStatisticRanking } from '@/types/cbb';


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

const Client = (
  { team, season, organization_id, division_id, seasons, coach, coach_statistic_ranking, conference_statistic_ranking }:
  { team: Team, season: number, organization_id: string, division_id: string, seasons: number[], coach: Coach | null, coach_statistic_ranking: CoachStatisticRanking | null, conference_statistic_ranking: ConferenceStatisticRanking },
) => {
  const breakPoint = 475;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const theme = useTheme();

  const { width } = useWindowDimensions() as Dimensions;
  const [isPending, startTransition] = useTransition();

  const displayRank = useAppSelector((state) => state.displayReducer.rank);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const conferences = useAppSelector((state) => state.dictionaryReducer.conference);
  const path = Organization.getPath({ organizations, organization_id });
  let numberOfTeams = CBB.getNumberOfD1Teams(season);

  if (organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id, season });
  }

  const teamHelper = new HelperTeam({ team });

  const conferenceName = teamHelper.getConference(conferences);
  const conferenceNumber = (organization_id === Organization.getCFBID() ? CFB.getNumberOfConferences({ division_id, season }) : 35);

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
  const conferenceRank = conference_statistic_ranking.rank;

  if (rank) {
    supStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / numberOfTeams)));
  }

  if (coachRank) {
    coachSupStyle.color = Color.lerpColor(bestColor, worstColor, (+(coachRank / numberOfTeams)));
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

  const seasonOptions = seasons.sort((a, b) => b - a).map((value) => {
    return {
      value: value.toString(),
      label: `${value - 1} - ${value}`,
    };
  });

  const getCoachHref = () => {
    return `/${path}/coach/${coach?.coach_id}`/* +'?season='+season */;
  };

  const handleCoach = (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(getCoachHref());
    });
  };

  const getConferenceHref = () => {
    return `/${path}/conference/${team.conference_id}?season=${season}`;
  };

  const handleConference = (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(getConferenceHref());
    });
  };

  return (
    <Contents>
      <PrimaryLine>
        <Typography style = {{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} type = {(width < breakPoint ? 'h6' : 'h5')}>
          {rank ? <span style = {supStyle}>{rank} </span> : ''}
          {teamHelper.getName()}
          <span style = {{ fontSize: '16px', verticalAlign: 'middle', display: 'inline-block', marginLeft: 5 }}>
            <Typography type = 'overline' style = {{ color: theme.text.secondary }}> ({team?.stats?.wins || 0}-{team?.stats?.losses || 0})</Typography>
          </span>
        </Typography>
        <FavoritePicker team_id = {team?.team_id} />
        <OptionPicker buttonName = {season.toString()} options = {seasonOptions} selected = {[season.toString()]} actionHandler = {handleSeason} isRadio = {true} />
      </PrimaryLine>
      <SecondaryLine>
        <Typography type = 'overline' style = {{ color: theme.text.secondary }}>{conferenceRank ? <span style = {conferenceSupStyle}>{conferenceRank} </span> : ''}<a onClick = {handleConference} href = {getConferenceHref()} style={{ cursor: 'pointer', color: theme.link.primary }}>{conferenceName}</a> | {coachRank ? <span style = {coachSupStyle}>{coachRank} </span> : ''}{coach ? <a onClick = {handleCoach} href = {getCoachHref()} style={{ cursor: 'pointer', color: theme.link.primary }}>{`${coach.first_name.charAt(0)}. ${coach.last_name}`}</a> : 'UNKNOWN'}</Typography>
      </SecondaryLine>
    </Contents>
  );
};

export { Client, ClientSkeleton };
