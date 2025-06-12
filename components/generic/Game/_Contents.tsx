/*'use client';


import { useAppSelector } from '@/redux/hooks';
import HelperGame from '@/components/helpers/Game';


const Contents = () => {
  const game = useAppSelector((state) => state.gameReducer.game);

  const Game = new HelperGame({
    game,
  });

  const view = useAppSelector((state) => state.gameReducer.view) || (Game.isInProgress() || Game.isFinal() ? 'game_details' : 'matchup');
  const subview = useAppSelector((state) => state.gameReducer.subview) || (view === 'game_details' ? 'boxscore' : null) || (view === 'trends' ? 'stat_compare' : null);


  const getContent = () => {
    if (view === 'game_details' && subview === 'boxscore') {
      // return (
      //   <BoxscoreClientWrapper>
      //     <Suspense fallback = {<BoxscoreClientSkeleton />}>
      //       <BoxscoreServer game = {game} />
      //     </Suspense>
      //   </BoxscoreClientWrapper>
      //   );
    } if (view === 'game_details' && subview === 'charts') {
      // return (
      //   <ChartsClientWrapper>
      //     <Suspense fallback = {<ChartsClientSkeleton />}>
      //       <ChartsServer game = {game} />
      //     </Suspense>
      //   </ChartsClientWrapper>
      // );
    } if (view === 'game_details' && subview === 'pbp') {
      // return (
      //   <PlaybyplayClientWrapper>
      //     <Suspense fallback = {<PlaybyplayClientSkeleton />}>
      //       <PlaybyplayServer game = {game} />
      //     </Suspense>
      //   </PlaybyplayClientWrapper>
      // );
    } if (view === 'matchup') {
      // return (
      //   <MatchupClientWrapper>
      //     <MatchupServer game = {game} />
      //   </MatchupClientWrapper>
      // );
    } if (view === 'trends' && subview === 'stat_compare') {
      // return (
      //   <StatCompareClientWrapper>
      //     <Suspense fallback = {<StatCompareClientSkeleton />}>
      //       <StatCompareServer game = {game} />
      //     </Suspense>
      //   </StatCompareClientWrapper>
      // );
    } if (view === 'trends' && subview === 'previous_matchups') {
      // return (
      //   <PreviousMatchupsClientWrapper>
      //     <Suspense fallback = {<PreviousMatchupsClientSkeleton />}>
      //       <PreviousMatchupsServer game = {game} />
      //     </Suspense>
      //   </PreviousMatchupsClientWrapper>
      // );
    } if (view === 'trends' && subview === 'odds') {
      // return (
      //   <OddsClientWrapper>
      //     <Suspense fallback = {<OddsClientSkeleton />}>
      //       <OddsServer game = {game} />
      //     </Suspense>
      //   </OddsClientWrapper>
      // );
    } if (view === 'trends' && subview === 'momentum') {
      // return (
      //   <MomentumClientWrapper>
      //     <Suspense fallback = {<MomentumClientSkeleton />}>
      //       <MomentumServer game = {game} />
      //     </Suspense>
      //   </MomentumClientWrapper>
      // );
    }
    return null;
  };


  return (
    <div>
      {getContent()}
    </div>
  );
};

export default Contents;
*/
