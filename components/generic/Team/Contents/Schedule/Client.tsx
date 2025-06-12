'use client';

import React from 'react';
import Typography from '@mui/material/Typography';

import moment from 'moment';

import Tile from '@/components/generic/Team/Contents/Schedule/Tile';
import { useAppSelector } from '@/redux/hooks';
import Differentials from './Differentials';
// import { useScrollContext } from '@/contexts/scrollContext';
import TableView from './TableView';
import { Skeleton } from '@mui/material';
import { Games } from '@/types/general';


/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  return (
    <div style = {{ padding: '20px 5px 20px 5px' }}>
      {children}
    </div>
  );
};

const ClientSkeleton = () => {
  const skeletons: React.JSX.Element[] = [];
  for (let i = 0; i < 30; i++) {
    skeletons.push(<Skeleton style = {{
      width: '100%', height: 40, margin: '5px 0px', padding: 0, transform: 'initial',
    }} />);
  }
  return (
    <Contents>
      {skeletons}
    </Contents>
  );
};

const Client = ({ games, team_id }: {games: Games, team_id: string}) => {
  const predictions = useAppSelector((state) => state.teamReducer.schedulePredictions);
  const scheduleView = useAppSelector((state) => state.teamReducer.scheduleView);
  const showScheduleDifferentials = useAppSelector((state) => state.teamReducer.showScheduleDifferentials);
  const visibleScheduleDifferentials = useAppSelector((state) => state.teamReducer.visibleScheduleDifferentials);
  // const scrollTop = useAppSelector((state) => state.teamReducer.scrollTop);

  // const [firstRender, setFirstRender] = useState(true);

  // const scrollRef = useScrollContext();


  // useEffect(() => {
  //   if (firstRender && scrollRef && scrollRef.current) {
  //     // todo something in nextjs is setting scrolltop to zero right after this, so trick it by putting this at the end of the execution :)
  //     // https://github.com/vercel/next.js/issues/20951
  //     setTimeout(() => {
  //       if (scrollRef && scrollRef.current) {
  //         scrollRef.current.scrollTop = scrollTop;
  //       }
  //     }, 1);
  //   }
  //   setFirstRender(false);
  // });

  for (const prediction_id in predictions) {
    const row = predictions[prediction_id];
    if (row.game_id in games) {
      // eslint-disable-next-line no-param-reassign
      games[row.game_id].prediction = row;
    }
  }

  const sorted_games = Object.values(games || {}).sort((a, b) => (a.start_date < b.start_date ? -1 : 1));

  const gameContainers: React.JSX.Element[] = [];
  let lastMonth: number | null = null;
  let lastYear: number | null = null;
  let nextUpcomingGame: boolean | null = null;

  if (scheduleView === 'default') {
    for (let i = 0; i < sorted_games.length; i++) {
      const game = sorted_games[i];

      if (!lastMonth || lastMonth < +moment(game.start_datetime).format('MM') || (lastYear && lastYear < +moment(game.start_datetime).format('YYYY'))) {
        lastMonth = +moment(game.start_datetime).format('MM');
        lastYear = +moment(game.start_datetime).format('YYYY');
        gameContainers.push(<Typography key = {i} style = {{ marginBottom: '10px', padding: 5 }} variant = 'body1'>{moment(game.start_datetime).format('MMMM')}</Typography>);
      }

      if (!nextUpcomingGame && (game.status === 'pre' || game.status === 'live')) {
        nextUpcomingGame = true;
        gameContainers.push(<Tile key = {game.game_id} game = {game} team = {game.teams[team_id]} />);
      } else {
        gameContainers.push(<Tile key = {game.game_id} game = {game} team = {game.teams[team_id]} />);
      }

      if (showScheduleDifferentials || visibleScheduleDifferentials.indexOf(game.game_id) > -1) {
        gameContainers.push(<Differentials key = {`differentials-${game.game_id}`} game = {game} team_id = {team_id} />);
      }
    }
  } else if (scheduleView === 'table') {
    gameContainers.push(<TableView sorted_games = {sorted_games} team_id = {team_id} />);
  }

  return (
    <Contents>
      {gameContainers}
    </Contents>
  );
};

export { Client, ClientSkeleton };
