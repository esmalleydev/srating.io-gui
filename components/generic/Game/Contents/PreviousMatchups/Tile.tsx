'use client';



import HelperGame from '@/components/helpers/Game';
import { useAppSelector } from '@/redux/hooks';
import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';
import Organization from '@/components/helpers/Organization';
import Navigation from '@/components/helpers/Navigation';
import { useTheme } from '@/components/hooks/useTheme';
import Dates from '@/components/utils/Dates';


const Tile = ({ game }) => {
  const navigation = new Navigation();
  const theme = useTheme();
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id: game.organization_id });

  const Game = new HelperGame({
    game,
  });

  const getColor = (side) => {
    if (side === 'away' && game.away_score > game.home_score) {
      return theme.success.light;
    }

    if (side === 'home' && game.away_score < game.home_score) {
      return theme.success.light;
    }

    return theme.text.primary;
  };

  const getTitle = () => {
    let team: string | null = null;
    if (game.away_score > game.home_score) {
      team = `${Game.getTeamName('away')} @`;
    } else if (game.away_score < game.home_score) {
      team = Game.getTeamName('home');
    }

    return <span style = {{ color: theme.success.light }}>{team}</span>;
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

  const getHref = () => {
    return `/${path}/games/${game.game_id}`;
  };

  const handleClick = () => {
    navigation.game(getHref());
  };

  return (
    <a href={getHref()} style = {{ textDecoration: 'none' }}>
      <Paper elevation = {3} hover style = {{ margin: '5px 10px', padding: 10, cursor: 'pointer' }} onClick = {handleClick}>
        <div>
          <Typography type = 'body2'>{Dates.format(game.start_date, 'M, jS, Y')}</Typography>
          <Typography type = 'body1'>{getTitle()} ({getScore()})</Typography>
        </div>
      </Paper>
    </a>
  );
};

export default Tile;
