'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import HelperGame from '@/components/helpers/Game';
import HelperTeam from '@/components/helpers/Team';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import BackButton from '@/components/generic/BackButton';
import Pin from '@/components/generic/Pin';
import { setLoading } from '@/redux/features/display-slice';
import Rank from './Rank';
import Record from './Record';
import Organization from '@/components/helpers/Organization';
import { Coaches, CoachTeamSeasons, Game } from '@/types/general';
import CoachRank from './CoachRank';
import CoachRecord from './CoachRecord';
import ConferenceRank from './ConferenceRank';
import ConferenceRecord from './ConferenceRecord';
import RefreshCounter from './RefreshCounter';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';


const getBreakPoint = () => {
  return 450;
};

const getHeaderHeight = () => {
  return 120;
};

const getMarginTop = () => {
  const { width } = useWindowDimensions() as Dimensions;

  let margin = 64;

  if (width < 600) {
    margin = 56;
  }

  return margin;
};

export { getHeaderHeight, getMarginTop, getBreakPoint };

/*
If you are ever looking at this because of the react dev tools and wondering why it is rendering so much, it is not, only the RefreshCounter is rendering
The tool are wrong and thinks everything in here is rendering, when they are not
*/

const ClientWrapper = (
  { game, coaches, coach_team_seasons, children }:
  { game: Game; coaches: Coaches; coach_team_seasons: CoachTeamSeasons; children: React.JSX.Element; },
) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();

  const { width } = useWindowDimensions() as Dimensions;
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const conferences = useAppSelector((state) => state.dictionaryReducer.conference);
  const path = Organization.getPath({ organizations, organization_id: game.organization_id });

  const Game = new HelperGame({
    game,
  });

  const team_id_x_coach_id = {};
  for (const coach_team_season_id in coach_team_seasons) {
    const row = coach_team_seasons[coach_team_season_id];

    if (
      row.coach_id in coaches &&
      (!row.start_date || row.start_date < game.start_date) &&
      (!row.end_date || row.end_date > game.start_date)
    ) {
      team_id_x_coach_id[row.team_id] = row.coach_id;
    }
  }

  const handleTeamClick = (team_id: string) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/${path}/team/${team_id}?season=${game.season}`);
    });
  };

  const handleConferenceClick = (conference_id: string | null) => {
    if (conference_id) {
      dispatch(setLoading(true));
      startTransition(() => {
        router.push(`/${path}/conference/${conference_id}?season=${game.season}`);
      });
    }
  };

  const handleCoachClick = (coach_id: string | null) => {
    if (coach_id) {
      dispatch(setLoading(true));
      startTransition(() => {
        router.push(`/${path}/coach/${coach_id}?season=${game.season}`);
      });
    }
  };

  const titleStyle: React.CSSProperties = {
    paddingTop: 5,
    height: getHeaderHeight(),
    position: 'sticky',
    top: getMarginTop(),
    backgroundColor: theme.background.main,
    zIndex: 1100,
  };


  let sideWidth = 115;
  let modifier = 150;

  if (Game.isInProgress() || Game.isFinal()) {
    modifier = 600;
  }

  if (width < 375) {
    sideWidth = 75;
  } else if (width < getBreakPoint()) {
    sideWidth = 100;
  } else if (width > getBreakPoint() && (width - (sideWidth * 2) - modifier) > 0) {
    sideWidth += (width - (sideWidth * 2) - 150) / 2;
  }

  if (sideWidth > 225) {
    sideWidth = 225;
  }

  const getTeam = (team_id: string) => {
    const team = game.teams[team_id];
    const teamHelper = new HelperTeam({ team });

    const conference_id = team.conference_id || null;

    const coach = team.team_id in team_id_x_coach_id ? coaches[team_id_x_coach_id[team.team_id]] : null;

    let justifyContent = 'left';
    let teamName = teamHelper.getName();

    if (team_id === game.home_team_id) {
      justifyContent = 'right';
    }

    if (width < getBreakPoint()) {
      teamName = teamHelper.getNameShort();
    }

    return (
      <div>
        <div style = {{
          display: 'flex', flexWrap: 'nowrap', cursor: 'pointer', justifyContent,
        }} onClick={() => { handleTeamClick(team_id); }}>
          <Typography style = {{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} type = {'body1'}>
            <Rank game={game} team_id={team_id} />
            <Typography type = 'a'>{teamName}</Typography>
            <Record game={game} team_id={team_id} />
          </Typography>
        </div>
        <div style = {{ display: 'flex', justifyContent }} onClick={() => { handleConferenceClick(conference_id); }}>
          <Typography style = {{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} type = {'caption'}>
            {conference_id ? <ConferenceRank game={game} conference_id={conference_id} /> : ''}
            <Typography type = 'a'>{teamHelper.getConference(conferences)}</Typography>
            {conference_id ? <ConferenceRecord game={game} team_id={team_id} /> : ''}
          </Typography>
        </div>
        <div style = {{ display: 'flex', justifyContent }} onClick={() => { handleCoachClick(coach && coach.coach_id); }}>
          <Typography style = {{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} type = {'caption'}>
            {coach ? <CoachRank game={game} coach_id={coach.coach_id} /> : ''}
            <Typography type = 'a'>{coach ? `${coach.first_name.charAt(0)}. ${coach.last_name}` : 'Unknown'}</Typography>
            {coach ? <CoachRecord game={game} coach_id={coach.coach_id} /> : ''}
          </Typography>
        </div>
      </div>
    );
  };


  return (
    <>
      <div style = {titleStyle}>
        <div style = {{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <div style = {{ width: sideWidth, display: 'flex', alignItems: 'baseline' }}>
            <BackButton />
          </div>
          {Game.getNetwork() ? <div><Typography style = {{ color: theme.text.secondary }} type = 'overline'>{Game.getNetwork()}</Typography></div> : ''}
          <div style = {{
            display: 'flex', justifyContent: 'end', position: 'relative', alignItems: 'baseline', width: sideWidth, minWidth: sideWidth,
          }}>
            <RefreshCounter game = {game} />
            <Pin game_id = {game.game_id} />
          </div>
        </div>
        <div style = {{
          display: 'flex', justifyContent: 'space-between', padding: '0px 5px', alignItems: 'center',
        }}>
          <div style = {{ maxWidth: sideWidth, minWidth: sideWidth }}>{getTeam(game.away_team_id)}</div>
          <div style = {{ width: '100%' }}>{children}</div>
          <div style = {{ maxWidth: sideWidth, minWidth: sideWidth }}>{getTeam(game.home_team_id)}</div>
        </div>
      </div>
    </>
  );
};

export default ClientWrapper;
