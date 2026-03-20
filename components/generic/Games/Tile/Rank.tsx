'use client';

import { useAppSelector } from '@/redux/hooks';
import Organization from '@/components/helpers/Organization';
import General from '@/components/helpers/General';
import { Color } from '@esmalley/ts-utils';
import Skeleton from '@/components/ux/loading/Skeleton';


const Rank = ({ game, team_id }) => {
  const gameStats = useAppSelector((state) => state.gamesReducer.gameStats);
  const gameStatsLoading = useAppSelector((state) => state.gamesReducer.gameStatsLoading);
  // const showScheduleHistoricalRankRecord = useAppSelector((state) => state.gamesReducer.showScheduleHistoricalRankRecord);
  const displayRank = useAppSelector((state) => state.displayReducer.rank);
  const numberOfTeams = Organization.getNumberOfTeams({ organization_id: game.organization_id, division_id: game.division_id, season: game.season });

  const current = (gameStats && gameStats[game.game_id] && gameStats[game.game_id].current[team_id]) || null;
  const historical = (gameStats && gameStats[game.game_id] && gameStats[game.game_id].historical[team_id]) || null;

  const statistic_ranking = game.status === 'final' ? historical : current;

  const bestColor = General.getBestColor();
  const worstColor = General.getWorstColor();

  let rank = null;
  if (statistic_ranking) {
    rank = displayRank in statistic_ranking ? statistic_ranking[displayRank] : statistic_ranking.rank;
  }

  const supRankStyle: React.CSSProperties = {
    fontSize: '11px',
    marginRight: '5px',
    fontWeight: 700,
  };

  if (rank) {
    supRankStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / numberOfTeams)));
  }


  return (
    <sup style = {supRankStyle}>
      {
        gameStatsLoading ?
          <Skeleton style={{ width: 15, height: 10, display: 'inline-block' }} />
          : rank || ''
      }
    </sup>
  );
};

export default Rank;
