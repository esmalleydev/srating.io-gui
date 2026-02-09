'use client';

import RankTable from '@/components/generic/RankTable';
import TableColumns from '@/components/helpers/TableColumns';
import { useTheme } from '@/components/hooks/useTheme';
import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const Ranking = () => {
  const theme = useTheme();
  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);
  const fantasy_rankings = useAppSelector((state) => state.fantasyGroupReducer.fantasy_rankings);

  const rows = Object.values(fantasy_rankings);

  const headCells = TableColumns.getColumns({ organization_id: fantasy_group.organization_id, view: 'fantasy' });
  const columns = ['rank', 'name'];


  const getContents = () => {
    if (rows.length) {
      return (
        <RankTable
          rows={rows}
          columns={headCells}
          displayColumns={columns}
          rowKey = 'fantasy_ranking_id'
          defaultSortOrder = 'asc'
          defaultSortOrderBy = 'rank'
          sessionStorageKey='fantasy_ranking_leaderboard'
        />
      );
    }

    return (
      <div style = {{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
        <span style = {{ display: 'flex', marginRight: 10 }}><SentimentVeryDissatisfiedIcon /></span>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>No rankings yet!</Typography>
      </div>
    );
  };



  return (
    <div>
      <Typography type = 'h6'>Leaderboard</Typography>
      <Paper style={{ padding: 16 }}>
        {getContents()}
      </Paper>
    </div>
  );
};

export default Ranking;
