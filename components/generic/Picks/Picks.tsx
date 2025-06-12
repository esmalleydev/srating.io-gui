'use client';


import Tile from '@/components/generic/Picks/Tile';
import { useAppSelector } from '@/redux/hooks';
import AdditionalOptions from '@/components/generic/Picks/AdditionalOptions';
import ConferencePicker from '@/components/generic/ConferencePicker';
import { Games } from '@/types/general';
import ConferenceChips from '../ConferenceChips';
import Typography from '@/components/ux/text/Typography';


const Picks = ({ games }: {games: Games}) => {
  const skip_sort_game_ids = useAppSelector((state) => state.favoriteReducer.skip_sort_game_ids);
  const game_ids = useAppSelector((state) => state.favoriteReducer.game_ids);
  const picksSort = useAppSelector((state) => state.displayReducer.picksSort);
  const selectedConferences = useAppSelector((state) => state.displayReducer.conferences);

  const sorted_games = Object.values(games);

  sorted_games.sort((a, b) => {
    const aIsPinned = (
      skip_sort_game_ids.indexOf(a.game_id) === -1 &&
      game_ids.length &&
      game_ids.indexOf(a.game_id) > -1
    );

    const bIsPinned = (
      skip_sort_game_ids.indexOf(b.game_id) === -1 &&
      game_ids.length &&
      game_ids.indexOf(b.game_id) > -1
    );

    if (aIsPinned && !bIsPinned) {
      return -1;
    }

    if (!aIsPinned && bIsPinned) {
      return 1;
    }

    if (
      picksSort === 'win_percentage' &&
      a.prediction &&
      b.prediction
    ) {
      const a_percentage = a.prediction.home_percentage > a.prediction.away_percentage ? a.prediction.home_percentage : a.prediction.away_percentage;
      const b_percentage = b.prediction.home_percentage > b.prediction.away_percentage ? b.prediction.home_percentage : b.prediction.away_percentage;

      if (a_percentage !== b_percentage) {
        return a_percentage > b_percentage ? -1 : 1;
      }
    }

    return a.start_datetime > b.start_datetime ? 1 : -1;
  });

  const gameContainers: React.JSX.Element[] = [];

  for (let i = 0; i < sorted_games.length; i++) {
    const game = sorted_games[i];

    if (
      selectedConferences.length &&
      selectedConferences.indexOf(game.teams[game.away_team_id].conference_id) === -1 &&
      selectedConferences.indexOf(game.teams[game.home_team_id].conference_id) === -1
    ) {
      continue;
    }

    gameContainers.push(<Tile key = {game.game_id} game = {game} />);
  }

  return (
    <>
      <div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ConferencePicker />
        <AdditionalOptions />
      </div>
      <div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ConferenceChips />
      </div>
      <div style = {{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {
          gameContainers.length ? gameContainers : <Typography type = 'h5'>No games found :( please adjust filter. </Typography>
        }
      </div>
    </>
  );
};

export default Picks;
