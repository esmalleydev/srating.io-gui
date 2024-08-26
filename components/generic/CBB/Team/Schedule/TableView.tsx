'use client';

import React, { useState, useTransition } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';


import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  Paper, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Skeleton,
} from '@mui/material';
import HelperCBB from '@/components/helpers/CBB';
import Locked from '@/components/generic/Billing/Locked';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import { useRouter } from 'next/navigation';
import { setLoading } from '@/redux/features/display-slice';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover td': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.info.dark,
  },
  '&:hover': {
    cursor: 'pointer',
  },
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900],
}));


const TableView = ({ sorted_games, team_id }) => {
  const dispatch = useAppDispatch();
  const isLoadingPredictions = useAppSelector((state) => state.teamReducer.schedulePredictionsLoading);

  const bestColor = getBestColor();
  const worstColor = getWorstColor();


  const router = useRouter();
  const [isPending, startTransition] = useTransition();


  const headCells = [
    {
      id: 'start_date',
      label: 'Date',
    },
    {
      id: 'team',
      label: 'Opponent',
    },
    {
      id: 'score',
      label: 'Score',
    },
    {
      id: 'prediction',
      label: 'Prediction',
    },
  ];

  const handleGameClick = (game_id) => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/cbb/games/${game_id}`);
    });
  };

  const rowContainers: React.JSX.Element[] = [];
  for (let i = 0; i < sorted_games.length; i++) {
    const game = sorted_games[i];

    const CBB = new HelperCBB({
      game,
    });

    const won = (game.home_score > game.away_score && game.home_team_id === team_id) || (game.home_score < game.away_score && game.away_team_id === team_id);
    const otherSide = game.home_team_id === team_id ? 'away' : 'home';

    const tableCells: React.JSX.Element[] = [];

    for (let j = 0; j < headCells.length; j++) {
      const column = headCells[j];

      if (column.id === 'start_date') {
        tableCells.push(<TableCell key = {j} style = {{ padding: '6px' }} onClick={() => { handleGameClick(game.game_id); }}>{`${CBB.getStartDate()} - ${CBB.getStartTime()}`}</TableCell>);
      } else if (column.id === 'team') {
        tableCells.push(<TableCell key = {j} style = {{ padding: '6px' }} onClick={() => { handleGameClick(game.game_id); }}>{game.home_team_id === team_id ? 'vs' : '@'} {CBB.getTeamName(otherSide)}</TableCell>);
      } else if (column.id === 'score') {
        let scoreText = '-';
        if (CBB.isFinal()) {
          scoreText = `${(won ? 'W ' : 'L ') + game.home_score}-${game.away_score}`;
        } else if (CBB.isInProgress()) {
          scoreText = 'Live';
        }
        tableCells.push(<TableCell key = {j} style = {{ padding: '6px' }} onClick={() => { handleGameClick(game.game_id); }}>{scoreText}</TableCell>);
      } else if (column.id === 'prediction') {
        const predictionContainer: React.JSX.Element[] = [];
        const hasAccessToPercentages = !(!game.prediction || (game.prediction.home_percentage === null && game.prediction.home_percentage === null));

        if (isLoadingPredictions) {
          predictionContainer.push(<Skeleton style = {{ width: '100%', height: '100%', transform: 'initial' }} key = {1} />);
        } else if (!hasAccessToPercentages) {
          predictionContainer.push(<Locked iconFontSize={null} key = {1} />);
        } else {
          const winPercentage = (game.home_team_id === team_id ? +(game.prediction.home_percentage * 100).toFixed(0) : +(game.prediction.away_percentage * 100).toFixed(0));
          predictionContainer.push(<Typography key = {'win_percent'} variant = 'caption' style = {{ color: Color.lerpColor(worstColor, bestColor, winPercentage / 100) }}>{winPercentage}%</Typography>);
        }
        tableCells.push(<TableCell key = {j} style = {{ padding: '6px', width: 75 }}>{predictionContainer}</TableCell>);
      }
    }

    rowContainers.push(
      <StyledTableRow
        key={game.game_id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        {tableCells}
      </StyledTableRow>,
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="player stats table">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => {
                const tdStyle = {
                  padding: '4px 5px',
                  whiteSpace: 'nowrap',
                };

                return (
                  <StyledTableHeadCell
                    sx = {tdStyle}
                    key={headCell.id}
                    align={'left'}
                  >
                    {headCell.label}
                  </StyledTableHeadCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowContainers}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableView;
