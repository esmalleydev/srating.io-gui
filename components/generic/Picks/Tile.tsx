'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';

import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import HelperGame from '@/components/helpers/Game';
import Indicator from '@/components/generic/Indicator';
import Pin from '@/components/generic/Pin';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setScrollTop } from '@/redux/features/picks-slice';
import { updateGameSort } from '@/redux/features/favorite-slice';
import { useScrollContext } from '@/contexts/scrollContext';
import { setLoading } from '@/redux/features/display-slice';
import Rank from './Tile/Rank';
import PredictionLine from './Tile/PredictionLine';
import StatLine from './Tile/StatLine';
import Organization from '@/components/helpers/Organization';


/**
* Get the loading skeletons for the picks stats
*/
export const getSkeleton = (numberOfSkeletons: number): React.JSX.Element[] => {
  const skeletons: React.JSX.Element[] = [];

  for (let i = 0; i < numberOfSkeletons; i++) {
    skeletons.push(<Skeleton key = {i} variant="text" animation="wave" sx = {{
      width: '100%', maxWidth, height: '30px', margin: '10px 0px',
    }} />);
  }

  return skeletons;
};

export const maxWidth = 750;

const Tile = ({ game }) => {
  const router = useRouter();

  const scrollRef = useScrollContext();
  const { width } = useWindowDimensions() as Dimensions;
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();

  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const conferences = useAppSelector((state) => state.dictionaryReducer.conference);

  const path = Organization.getPath({ organizations, organization_id: game.organization_id });

  const Game = new HelperGame({
    game,
  });

  const handleMatchup = (e) => {
    if (
      scrollRef &&
      scrollRef.current
    ) {
      dispatch(setScrollTop(scrollRef.current.scrollTop));
    }
    dispatch(updateGameSort(null));
    dispatch(setLoading(true));
    startTransition(() => {
      router.push(`/${path}/games/${game.game_id}`);
    });
  };


  /**
   * Get game start time line with pin button
   * @return {Object} div container
   */
  const getTime = () => {
    const network: React.JSX.Element[] = [];

    if (!Game.isFinal() && Game.getNetwork()) {
      network.push(<Typography key = {Game.getNetwork()} sx = {{ marginLeft: '5px' }} color = 'text.secondary' variant = 'overline'>{Game.getNetwork()}</Typography>);
    }
    return (
      <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Typography color = {Game.isInProgress() ? 'info.dark' : 'text.secondary'} variant = 'overline'>{Game.getTime()}</Typography>{network}</div>
        <Pin game_id = {game.game_id} />
      </div>
    );
  };

  const getIndicators = () => {
    const flexContainer = {
      display: 'flex',
      alignItems: 'left',
      margin: '0px 10px',
    };

    const indicators: React.JSX.Element[] = [];

    if (Game.isNeutralSite()) {
      indicators.push(
        <Indicator key = {'N'} title = {'Neutral site'} code = {'N'} color = {'#ffa726'} />,
      );
    }

    return (
      <div style = {flexContainer} >
        {indicators}
      </div>
    );
  };

  /**
   * Get the header line.
   * Ex: Purdue vs Indiana
   * @return {Object} div container
   */
  const getHeader = () => {
    const flexContainerStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'nowrap',
      width: '100%',
      maxWidth,
      alignItems: 'center',
    };


    const awayName = Game.getTeamName('away');
    const homeName = Game.getTeamName('home');

    const fontSize = width > 525 ? '1.1rem' : '1rem';
    // eslint-disable-next-line no-nested-ternary
    const maxWidthTypography = width <= 425 ? 140 : (width <= 375 ? 120 : 1000);


    return (
      <div style={flexContainerStyle}>
        <Typography variant = 'h6' style = {{
          textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', fontSize, maxWidth: maxWidthTypography,
        }}>
          <Rank game={game} team_id={game.away_team_id} /> {awayName}
        </Typography>
        <Typography variant = 'h6' style = {{
          textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', fontSize, maxWidth: maxWidthTypography,
        }}>
          <Rank game={game} team_id={game.home_team_id} /> {homeName}
        </Typography>
      </div>
    );
  };

  /**
   * Get the secondary header, contains conference
   * @return {Object} div container
   */
  const getSecondaryHeader = () => {
    const containerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth,
      alignItems: 'center',
    };
    return (
      <div style={containerStyle}>
        <Typography variant = 'overline' color = 'text.secondary' style = {{
          textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: (width < 525 ? 100 : 200),
        }}>{Game.getTeamConference('away', conferences)}</Typography>
        <Typography variant = 'overline' color = 'text.secondary' style = {{
          textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: (width < 525 ? 100 : 200),
        }}>{Game.getTeamConference('home', conferences)}</Typography>
      </div>
    );
  };

  /**
   * Get the ML, spread and over / under lines
   * @return {Object} div container
   */
  const getOdds = () => {
    const containerStyle = {
      display: 'flex',
      justifyContent: 'left',
      width: '100%',
      maxWidth,
      alignItems: 'center',
    };

    return (
      <div>
        <div style={containerStyle}>
          <Typography color = 'text.secondary' sx = {{ display: 'block', lineHeight: '20px' }} variant = 'overline'>Money Line: {Game.getPreML('away')} / {Game.getPreML('home')}</Typography>
        </div>
        <div style={containerStyle}>
          <Typography color = 'text.secondary' sx = {{ display: 'block', lineHeight: '20px' }} variant = 'overline'>Spread: {Game.getPreSpread('away')} / {Game.getPreSpread('home')}</Typography>
        </div>
        <div style={containerStyle}>
          <Typography color = 'text.secondary' sx = {{ display: 'block', lineHeight: '20px' }} variant = 'overline'>O/U: {Game.getPreOver()} / {Game.getPreUnder()}</Typography>
        </div>
      </div>
    );
  };


  return (
    <Paper style = {{ width: '100%', maxWidth, margin: '10px 0px' }}>
      {getIndicators()}
      <div style = {{ padding: '10px' }}>
        {getTime()}
        {getHeader()}
        {getSecondaryHeader()}
        <PredictionLine game = {game} />
        <StatLine game = {game} />
        {getOdds()}
        <div style = {{ textAlign: 'right' }}>
          <Button onClick = {handleMatchup}>Full matchup</Button>
        </div>
      </div>
    </Paper>
  );
};


export default Tile;
