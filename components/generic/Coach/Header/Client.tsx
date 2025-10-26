'use client';

// import FavoritePicker from '@/components/generic/FavoritePicker';
import HelperTeam from '@/components/helpers/Team';
import { useAppSelector } from '@/redux/hooks';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { Coach } from '@/types/general';
import { Skeleton } from '@mui/material';
import Organization from '@/components/helpers/Organization';
import CBB from '@/components/helpers/CBB';
import CFB from '@/components/helpers/CFB';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';
import Navigation from '@/components/helpers/Navigation';


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

const Client = ({ organization_id, division_id, coach_statistic_rankings, season }) => {
  const { width } = useWindowDimensions() as Dimensions;
  const theme = useTheme();
  const navigation = new Navigation();
  const coach: Coach = useAppSelector((state) => state.coachReducer.coach);
  const coach_team_seasons = useAppSelector((state) => state.coachReducer.coach_team_seasons);
  const teams = useAppSelector((state) => state.coachReducer.teams);
  const statistic_rankings = useAppSelector((state) => state.coachReducer.statistic_rankings);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id });
  const numberOfTeams = Organization.getNumberOfTeams({ organization_id, division_id, season });

  const season_x_team_id = {};

  let maxSeason: number | null = null;

  for (const coach_team_season_id in coach_team_seasons) {
    const row = coach_team_seasons[coach_team_season_id];
    season_x_team_id[row.season] = row.team_id;

    if (!maxSeason || maxSeason < row.season) {
      maxSeason = row.season;
    }
  }

  const lastSeason = (season in season_x_team_id ? season : (
    maxSeason || Object.keys(teams)[0]
  ));

  const season_x_coach_statistic_ranking_id = {};

  for (const coach_statistic_ranking_id in coach_statistic_rankings) {
    const row = coach_statistic_rankings[coach_statistic_ranking_id];

    season_x_coach_statistic_ranking_id[row.season] = coach_statistic_ranking_id;
  }

  const season_x_statistic_ranking_id = {};

  for (const statistic_ranking_id in statistic_rankings) {
    const row = statistic_rankings[statistic_ranking_id];

    if (row.team_id === season_x_team_id[lastSeason]) {
      season_x_statistic_ranking_id[row.season] = statistic_ranking_id;
    }
  }

  const coach_statistic_ranking = coach_statistic_rankings[season_x_coach_statistic_ranking_id[lastSeason]];
  const statistic_ranking = statistic_rankings[season_x_statistic_ranking_id[lastSeason]];

  const team = teams[season_x_team_id[lastSeason]];
  const breakPoint = 475;


  const teamHelper = new HelperTeam({ team });

  const bestColor = getBestColor();
  const worstColor = getWorstColor();


  const supStyle: React.CSSProperties = {
    fontSize: (width < breakPoint ? '12px' : '16px'),
    verticalAlign: 'super',
  };

  const teamSupStyle: React.CSSProperties = {
    fontSize: '10px',
    verticalAlign: 'super',
  };

  const coachRank = coach_statistic_ranking ? coach_statistic_ranking.rank : null;
  const teamRank = statistic_ranking ? statistic_ranking.rank : null;

  if (coachRank) {
    supStyle.color = Color.lerpColor(bestColor, worstColor, (+(coachRank / numberOfTeams)));
  }

  if (teamRank) {
    teamSupStyle.color = Color.lerpColor(bestColor, worstColor, (+(teamRank / numberOfTeams)));
  }

  const getTeamHref = () => {
    if (!team || !team.team_id) {
      return '/';
    }

    return `/${path}/team/${team.team_id}?season=${season}`;
  };

  const handleTeamClick = (e) => {
    e.preventDefault();
    if (!team || !team.team_id) {
      return;
    }
    navigation.team(getTeamHref());
  };


  return (
    <Contents>
      <PrimaryLine>
        <Typography style = {{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} type = {(width < breakPoint ? 'h6' : 'h5')}>
          {coachRank ? <span style = {supStyle}>{coachRank} </span> : ''}
          {`${coach.first_name} ${coach.last_name}`}
          <span style = {{ fontSize: '16px', verticalAlign: 'middle', display: 'inline-block', marginLeft: 5 }}>
            <Typography type = 'overline' style = {{ color: theme.text.secondary }}> ({coach_statistic_ranking?.wins || 0}-{coach_statistic_ranking?.losses || 0}){Organization.getCFBID() === organization_id ? '* since \'00' : ''}</Typography>
          </span>
        </Typography>
      </PrimaryLine>
      <SecondaryLine>
        <Typography type = 'overline' style = {{ color: theme.text.secondary }}>
          {teamRank ? <span style = {teamSupStyle}>{teamRank} </span> : ''}
          <a style = {{ cursor: 'pointer', color: theme.link.primary }} onClick={handleTeamClick} href = {getTeamHref()}>{teamHelper.getName()}</a>
        </Typography>
      </SecondaryLine>
    </Contents>
  );
};

export { Client, ClientSkeleton };
