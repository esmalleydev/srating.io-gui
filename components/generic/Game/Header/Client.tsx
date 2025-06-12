'use client';

import HelperGame from '@/components/helpers/Game';
import { getBreakPoint } from '@/components/generic/Game/Header/ClientWrapper';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import Refresher from '../Refresher';
import { Game } from '@/types/general';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';


const Client = (
  { game, tag }:
  { game: Game; tag: string; },
) => {
  const { width } = useWindowDimensions() as Dimensions;
  const theme = useTheme();

  let scoreVariant: string = 'h4';

  if (width < getBreakPoint()) {
    scoreVariant = 'h6';
  }

  const Game = new HelperGame({
    game,
  });

  const getScore = (score: number | null) => {
    if (!Game.isInProgress() && !Game.isFinal()) {
      return null;
    }

    return (
      <div>
        <Typography type = {scoreVariant as 'h4' | 'h5'}>{score || 0}</Typography>
      </div>
    );
  };

  const getTime = () => {
    return (
      <div>
        {!Game.isInProgress() ? <div><Typography type = 'overline' style = {{ color: theme.text.secondary }}>{Game.getStartDate(null)}</Typography></div> : ''}
        <div><Typography type = 'overline' style = {{ color: theme.info.dark }}>{Game.getTime()}</Typography></div>
      </div>
    );
  };

  return (
    <>
      <div style = {{
        display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', textAlign: 'center',
      }}>
        {getScore(game.away_score)}
        {getTime()}
        {getScore(game.home_score)}
      </div>
      <Refresher key = {game.game_id} game = {game} tag = {tag} />
    </>
  );
};

export default Client;
