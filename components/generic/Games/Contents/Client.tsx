'use client';

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  Chip, Paper, Skeleton, Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Game } from '@/types/general';
import { getHeaderHeight } from '@/components/generic/Games/SubNavBar';
import { updateConferences } from '@/redux/features/display-slice';
import Tile, { getTileBaseStyle } from '@/components/generic/Games/Tile';
import { useScrollContext } from '@/contexts/scrollContext';

const Contents = ({ children }) => {
  const dispatch = useAppDispatch();
  const selectedConferences = useAppSelector((state) => state.displayReducer.conferences);
  const conferences = useAppSelector((state) => state.dictionaryReducer.conference);

  const confChips: React.JSX.Element[] = [];
  for (let i = 0; i < selectedConferences.length; i++) {
    confChips.push(<Chip key = {selectedConferences[i]} sx = {{ margin: '5px' }} label={conferences[selectedConferences[i]].code} onDelete={() => { dispatch(updateConferences(selectedConferences[i])); }} />);
  }

  const gameContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 60,
  };

  return (
    <div style = {{ padding: '46px 2.5px 0px 2.5px', marginTop: getHeaderHeight() }}>
      <div style = {{
        display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap',
      }}>
        {confChips}
      </div>
      <div style = {gameContainerStyle}>
        {children}
      </div>
    </div>
  );
};

const ClientSkeleton = ({ games }) => {
  const tiles: React.JSX.Element[] = [];

  const divStyle = getTileBaseStyle();

  for (const game_id in games) {
    tiles.push(
      <Paper elevation={3} style = {divStyle} key = {`paper_${game_id}`}>
        <Skeleton style = {{ height: divStyle.height, transform: 'initial' }} />
      </Paper>,
    );
  }

  return (
    <Contents>
      {tiles}
    </Contents>
  );
};

const Client = ({ games, date }) => {
  const now = moment().format('YYYY-MM-DD');

  const skip_sort_game_ids = useAppSelector((state) => state.favoriteReducer.skip_sort_game_ids);
  const favorite_game_ids = useAppSelector((state) => state.favoriteReducer.game_ids);
  const selectedConferences = useAppSelector((state) => state.displayReducer.conferences);
  const statuses = useAppSelector((state) => state.displayReducer.statuses);
  const scores = useAppSelector((state) => state.gamesReducer.scores);
  const datesChecked = useAppSelector((state) => state.gamesReducer.dates_checked);
  const scrollTop = useAppSelector((state) => state.gamesReducer.scrollTop);

  const [firstRender, setFirstRender] = useState(true);

  const scrollRef = useScrollContext();


  useEffect(() => {
    if (firstRender && scrollRef && scrollRef.current) {
      // todo something in nextjs is setting scrolltop to zero right after this, so trick it by putting this at the end of the execution :)
      // https://github.com/vercel/next.js/issues/20951
      setTimeout(() => {
        if (scrollRef && scrollRef.current) {
          scrollRef.current.scrollTop = scrollTop;
        }
      }, 1);
    }
    setFirstRender(false);
  });

  for (const game_id in scores) {
    if (game_id in games) {
      Object.assign(games[game_id], scores[game_id]);
    }
  }

  const gameContainers: React.JSX.Element[] = [];

  const sorted_games: Game[] = Object.values(games);

  sorted_games.sort((a, b) => {
    const aIsPinned = (
      skip_sort_game_ids.indexOf(a.game_id) === -1 &&
      favorite_game_ids.length &&
      favorite_game_ids.indexOf(a.game_id) > -1
    );

    const bIsPinned = (
      skip_sort_game_ids.indexOf(b.game_id) === -1 &&
      favorite_game_ids.length &&
      favorite_game_ids.indexOf(b.game_id) > -1
    );

    if (aIsPinned && !bIsPinned) {
      return -1;
    }

    if (!aIsPinned && bIsPinned) {
      return 1;
    }

    if (
      a.status === 'live' &&
      b.status !== 'live'
    ) {
      return -1;
    }

    if (
      a.status !== 'live' &&
      b.status === 'live'
    ) {
      return 1;
    }

    if (
      a.status === 'final' &&
      b.status === 'pre'
    ) {
      return 1;
    }

    if (
      a.status === 'pre' &&
      b.status === 'final'
    ) {
      return -1;
    }
    return a.start_datetime > b.start_datetime ? 1 : -1;
  });


  for (let i = 0; i < sorted_games.length; i++) {
    const sortedGame = sorted_games[i];

    // remove games where a team is TBA

    if (
      !sortedGame.teams ||
      !sortedGame.teams[sortedGame.away_team_id] ||
      !sortedGame.teams[sortedGame.home_team_id]
    ) {
      continue;
    }

    if (
      selectedConferences.length &&
      selectedConferences.indexOf(sortedGame.teams[sortedGame.away_team_id].conference_id) === -1 &&
      selectedConferences.indexOf(sortedGame.teams[sortedGame.home_team_id].conference_id) === -1
    ) {
      continue;
    }

    if (statuses.indexOf(sortedGame.status) === -1) {
      continue;
    }

    // remove games that are today but still TBA
    let sortedGametimestamp;
    if (
      sortedGame.status === 'pre' &&
      sortedGame.start_date.split('T')[0] === now &&
      (sortedGametimestamp = new Date(sortedGame.start_timestamp * 1000)) &&
      sortedGametimestamp.getHours() >= 0 && sortedGametimestamp.getHours() <= 6
    ) {
      continue;
    }
    gameContainers.push(<Tile key={i} game={sortedGame} isLoadingWinPercentage = {!datesChecked[date]} />);
  }


  return (
    <Contents>
      {
        gameContainers.length ?
          gameContainers :
          <Typography variant = 'h5'>No games found :( please adjust filter. </Typography>
      }
    </Contents>
  );
};

export { Client, ClientSkeleton };
