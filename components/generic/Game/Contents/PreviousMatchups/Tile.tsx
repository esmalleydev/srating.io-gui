'use client';

import { useTransition } from 'react';
import { useTheme } from '@mui/material/styles';

import moment from 'moment';

import HelperGame from '@/components/helpers/Game';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';
import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';
import Organization from '@/components/helpers/Organization';


const Tile = ({ game }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id: game.organization_id });

  const Game = new HelperGame({
    game,
  });

  const getColor = (side) => {
    if (side === 'away' && game.away_score > game.home_score) {
      return theme.palette.success.light;
    }

    if (side === 'home' && game.away_score < game.home_score) {
      return theme.palette.success.light;
    }

    return theme.palette.text.primary;
  };

  const getTitle = () => {
    let team: string | null = null;
    if (game.away_score > game.home_score) {
      team = `${Game.getTeamName('away')} @`;
    } else if (game.away_score < game.home_score) {
      team = Game.getTeamName('home');
    }

    return <span style = {{ color: theme.palette.success.light }}>{team}</span>;
  };

  const getScore = () => {
    let score: string | null = null;
    if (game.away_score > game.home_score) {
      score = `${game.away_score} - ${game.home_score}`;
    } else if (game.away_score < game.home_score) {
      score = `${game.home_score} - ${game.away_score}`;
    }

    return <span>{score}</span>;
  };

  const handleClick = () => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/${path}/games/${game.game_id}`);
    });
  };

  return (
    <Paper elevation = {3} hover style = {{ margin: '5px 10px', padding: 10, cursor: 'pointer' }} onClick = {handleClick}>
      <div>
        <Typography type = 'body2'>{moment(game.start_date).format('MMM Do, YYYY')}</Typography>
        <Typography type = 'body1'>{getTitle()} ({getScore()})</Typography>
      </div>
    </Paper>
  );
};

export default Tile;
