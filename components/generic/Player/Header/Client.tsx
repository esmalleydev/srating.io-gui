'use client';

import React, { useTransition } from 'react';

// import FavoritePicker from '@/components/generic/FavoritePicker';
import Organization from '@/components/helpers/Organization';
import HelperTeam from '@/components/helpers/Team';
import HelperPlayer from '@/components/helpers/Player';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { Player, PlayerTeamSeasons, Team, Teams } from '@/types/general';
import { Skeleton } from '@mui/material';
import { setLoading } from '@/redux/features/display-slice';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';
import FavoritePicker from '../../FavoritePicker';
import OptionPicker from '../../OptionPicker';
import { PlayerStatisticRanking, StatisticRanking } from '@/types/cbb';


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
 * The first line, containing the player name + buttons
 */
const PrimaryLine = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center' }}>
      {children}
    </div>
  );
};


/**
 * The second line, containing the team
 */
const SecondaryLine = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ display: 'flex', justifyContent: 'center' }}>
      {children}
    </div>
  );
};

/**
 * The third line, containing the number, position, height
 */
const TertiaryLine = ({ children }): React.JSX.Element => {
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
      <TertiaryLine>
        <Skeleton width={200} height={28} />
      </TertiaryLine>
    </Contents>
  );
};

const Client = (
  { organization_id, division_id, player_statistic_ranking, statistic_ranking, season }:
  { organization_id: string, division_id: string, player_statistic_ranking: PlayerStatisticRanking, statistic_ranking: StatisticRanking, season: number },
) => {
  const theme = useTheme();
  const player: Player = useAppSelector((state) => state.playerReducer.player);
  const team: Team | null = useAppSelector((state) => state.playerReducer.team);
  const player_team_seasons: PlayerTeamSeasons = useAppSelector((state) => state.playerReducer.player_team_seasons);
  const teams: Teams = useAppSelector((state) => state.playerReducer.teams);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id });

  const breakPoint = 475;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const { width } = useWindowDimensions() as Dimensions;

  const [isPending, startTransition] = useTransition();


  const teamHelper = new HelperTeam({ team });
  const playerHelper = new HelperPlayer({ player });

  const bestColor = getBestColor();
  const worstColor = getWorstColor();


  const supStyle: React.CSSProperties = {
    fontSize: '12px',
    verticalAlign: 'super',
  };

  const teamSupStyle: React.CSSProperties = {
    fontSize: '10px',
    verticalAlign: 'super',
  };

  const playerRank = (player_statistic_ranking && player_statistic_ranking.rank) || null;
  const teamRank = (statistic_ranking && statistic_ranking.rank) || null;

  if (playerRank) {
    supStyle.color = Color.lerpColor(bestColor, worstColor, (+(playerRank / player_statistic_ranking.max)));
  }

  if (teamRank) {
    teamSupStyle.color = Color.lerpColor(bestColor, worstColor, (+(teamRank / statistic_ranking.max)));
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
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(getTeamHref());
    });
  };

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

  const seasonOptions = Object.values(player_team_seasons).sort((a, b) => b.season - a.season).map((row) => {
    const team = teams[row.team_id] || null;
    const tHelper = new HelperTeam({ team });
    return {
      value: row.season.toString(),
      label: `${row.season - 1} - ${row.season}`,
      sublabel: tHelper.getName(),
    };
  });


  return (
    <Contents>
      <PrimaryLine>
        <Typography style = {{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} type = {(width < breakPoint ? 'h6' : 'h5')}>
          {playerRank ? <span style = {supStyle}>{playerRank} </span> : ''}
          {playerHelper.getName()}
        </Typography>
        <FavoritePicker player_id = {player?.player_id} />
        <OptionPicker buttonName = {season.toString()} options = {seasonOptions} selected = {[season.toString()]} actionHandler = {handleSeason} isRadio = {true} />
      </PrimaryLine>
      <SecondaryLine>
        <Typography type = 'overline' style = {{ color: theme.text.secondary }}>
          {teamRank ? <span style = {teamSupStyle}>{teamRank} </span> : ''}
          <a style = {{ cursor: 'pointer', color: theme.link.primary }} onClick={handleTeamClick} href = {getTeamHref()} >{teamHelper.getName()}</a>
          <span style = {{ fontSize: '16px', verticalAlign: 'middle', display: 'inline-block', marginLeft: 5 }}>
            <Typography type = 'overline' style = {{ color: theme.text.secondary }}> ({statistic_ranking?.wins || 0}-{statistic_ranking?.losses || 0})</Typography>
          </span>
        </Typography>
      </SecondaryLine>
      <TertiaryLine>
        <span style = {{ fontSize: '16px', verticalAlign: 'middle', display: 'inline-block', marginLeft: 5 }}>
          <Typography type = 'overline' style = {{ color: theme.text.secondary }}> #{player?.number || 0} {player?.position || 'U'} {player.height ? player.height.replace('-', '\'') : ''}</Typography>
        </span>
      </TertiaryLine>
    </Contents>
  );
};

export { Client, ClientSkeleton };
