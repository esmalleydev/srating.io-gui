'use client';

import { LinearProgress, Tooltip } from '@mui/material';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import Organization from '@/components/helpers/Organization';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';
import CBB from '@/components/helpers/CBB';
import { getNavHeaderHeight } from '../../NavBar';
import { getSubNavHeaderHeight } from '../../SubNavbar';
import RankSpan from '@/components/generic/RankSpan';
import TableColumns from '@/components/helpers/TableColumns';

/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div>
      {children}
    </div>
  );
};


const ClientSkeleton = () => {
  const paddingTop = getNavHeaderHeight() + getSubNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 84;
  return (
    <Contents>
      <div style = {{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: `calc(100vh - ${heightToRemove}px)`,
      }}>
        <LinearProgress color = 'secondary' style={{ width: '50%' }} />
      </div>
    </Contents>
  );
};

const Client = ({ organization_id, division_id, season, player_statistic_ranking }) => {
  const theme = useTheme();

  const getMax = () => {
    if (Organization.isCFB()) {
      // todo get CFB players length
      return 0;
    //   return CFB.getNumberOfD1Players({ division_id, season });
    }

    return CBB.getNumberOfD1Players(season);
  };

  const maxPlayers = getMax();

  const columns = TableColumns.getColumns({ organization_id, view: 'player' });

  const getSections = () => {
    if (Organization.isCFB()) {
      return [
        {
          name: 'Efficiency',
          keys: [
            'points',
            'passing_rating_college',
            'passing_rating_pro',
            'yards_per_play',
            'points_per_play',
            // defensive_dvoa,
            // offensive_dvoa,
          ],
        },
        {
          name: 'Passing',
          keys: [
            'passing_attempts',
            'passing_completions',
            'passing_yards',
            'passing_completion_percentage',
            'passing_yards_per_attempt',
            'passing_yards_per_completion',
            'passing_touchdowns',
            'passing_interceptions',
            'passing_rating_pro',
            'passing_rating_college',
            'passing_long',
          ],
        },
        {
          name: 'Rushing',
          keys: [
            'rushing_attempts',
            'rushing_yards',
            'rushing_yards_per_attempt',
            'rushing_touchdowns',
            'rushing_long',
          ],
        },
        {
          name: 'Receiving',
          keys: [
            'receptions',
            'receiving_yards',
            'receiving_yards_per_reception',
            'receiving_touchdowns',
            'receiving_long',
          ],
        },
      ];
    }

    // defaulting to CBB
    return [
      {
        name: 'Overview',
        keys: [
          'games',
          'minutes_per_game',
          'points_per_game',
          'efficiency_rating',
          'player_efficiency_rating',
          'offensive_rating',
          'defensive_rating',
          'effective_field_goal_percentage',
          'true_shooting_percentage',
          'usage_percentage',
        ],
      },
      {
        name: 'Offense',
        keys: [
          'field_goal',
          'field_goal_attempts',
          'field_goal_percentage',
          'two_point_field_goal',
          'two_point_field_goal_attempts',
          'two_point_field_goal_percentage',
          'three_point_field_goal',
          'three_point_field_goal_attempts',
          'three_point_field_goal_percentage',
          'free_throws',
          'free_throw_attempts',
          'free_throw_percentage',
        ],
      },
      {
        name: 'Special',
        keys: [
          'offensive_rebounds',
          'defensive_rebounds',
          'assists',
          'steals',
          'blocks',
          'turnovers',
          'fouls',
        ],
      },
      {
        name: 'Percentage',
        keys: [
          'offensive_rebound_percentage',
          'defensive_rebound_percentage',
          'total_rebound_percentage',
          'assist_percentage',
          'steal_percentage',
          'block_percentage',
          'turnover_percentage',
          'usage_percentage',
        ],
      },
    ];
  };

  const sections = getSections();

  const getStatBlock = (key: string) => {
    const column = columns[key];
    const statistic = key in player_statistic_ranking ? player_statistic_ranking[key] : null;
    const rank = key in player_statistic_ranking ? player_statistic_ranking[`${key}_rank`] : null;
    return (
      <div key = {`${column.id}-div`} style = {{
        textAlign: 'center', flex: '1', minWidth: 100, maxWidth: 100, margin: 10,
      }}>
        <Tooltip key={column.id} disableFocusListener placement = 'top' title={column.tooltip}><Typography type='body1' style = {{ color: theme.text.secondary }}>{column.label}</Typography></Tooltip>
        {/* <hr style = {{'padding': 0, 'margin': 'auto', 'width': 50}} /> */}
        <div><Typography style = {{ display: 'inline-block' }} type='caption'>{statistic || 0}</Typography>{rank ? <RankSpan rank = {rank} useOrdinal = {true} max = {maxPlayers} /> : ''}</div>
      </div>
    );
  };

  return (
    <Contents>
      <div style = {{ padding: '0px 5px' }}>
        {sections.map(({ name, keys }, sectionIndex) => {
          return (
            <div key = {`section-${name}-fragment`}>
              <Typography type='subtitle' >{name}</Typography>
              <div style = {{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {keys.map((key) => {
                  return getStatBlock(key);
                })}
              </div>
              {sectionIndex < sections.length - 1 ? <hr /> : ''}
            </div>
          );
        })}
      </div>
    </Contents>
  );
};

export { Client, ClientSkeleton };
