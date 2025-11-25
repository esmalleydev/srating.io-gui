'use client';

import { updateDataKey as updateDataKeyDisplay } from '@/redux/features/display-slice';
import { InitialState, InitialStateKeys, resetDataKey as resetDataKeyPlayer, reset as resetPlayer, setDataKey as setDataKeyPlayer } from '@/redux/features/player-slice';
import { reset as resetCoach } from '@/redux/features/coach-slice';
import { reset as resetConference } from '@/redux/features/conference-slice';
import { reset as resetTeam } from '@/redux/features/team-slice';
import { reset as resetGames } from '@/redux/features/games-slice';
import { reset as resetGame } from '@/redux/features/game-slice';
import { reset as resetPicks, setDataKey as setDataKeyPicks, InitialStateKeys as InitialStateKeysPicks, InitialState as InitialStatePicks } from '@/redux/features/picks-slice';
import { useAppDispatch } from '@/redux/hooks';
import { AppDispatch } from '@/redux/store';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname, useRouter } from 'next/navigation';
import { TransitionStartFunction, useTransition } from 'react';
import { resetDataKey as resetDataKeyRanking, reset as resetRanking, setDataKey as setDataKeyRanking } from '@/redux/features/ranking-slice';
import { setLoading } from '@/redux/features/loading-slice';

// todo remove nextjs router :D

class Navigation {
  constructor() {
    this.dispatch = useAppDispatch();
    const [isPending, startTransition] = useTransition();
    this.isPending = isPending;
    this.startTransition = startTransition;
    this.router = useRouter();
    this.pathName = usePathname();
  }

  private dispatch: AppDispatch;

  private isPending: boolean;

  private startTransition: TransitionStartFunction;

  private router: AppRouterInstance;

  private pathName: string;

  public getRouter() {
    return this.router;
  }

  /**
   * Navigate to a player page,
   * reset the state to be fresh beforehand
   */
  public player(path: string, onRouter: null | undefined | (() => void) = null) {
    this.dispatch(setLoading(true));
    // this.dispatch(stateThunk({ router: this.getRouter() }));
    this.dispatch(resetPlayer(false));
    this.startTransition(() => {
      this.router.push(path);
      if (onRouter) {
        onRouter();
      }
    });
  }

  /**
   * Navigate to something on a player view. Must already be on player view
   */
  public playerView<K extends InitialStateKeys>(args: Pick<InitialState, K>, onRouter: null | undefined | (() => void) = null) {
    if (!this.pathName.includes('player')) {
      throw new Error('playerView only usable when already navigated to player');
    }

    for (const key in args) {
      this.dispatch(setDataKeyPlayer({ key, value: args[key] }));
    }


    // these MUST always be set this way if the view changes
    if ('view' in args) {
      this.dispatch(setDataKeyPlayer({ key: 'subview', value: null }));
      this.dispatch(resetDataKeyPlayer('trendsSeasons'));
      this.dispatch(resetDataKeyPlayer('trendsBoxscoreLine'));
      this.dispatch(resetDataKeyPlayer('trendsColumn'));
    }


    this.dispatch(setDataKeyPlayer({ key: 'loadingView', value: true }));

    // player slice handles this now, but just refetch it here for stupid nextjs router
    const current = new URLSearchParams(window.location.search);
    const search = current.toString();
    const query = search ? `?${search}` : '';

    this.startTransition(() => {
      this.router.replace(`${this.pathName}${query}`);
      if (onRouter) {
        onRouter();
      }
    });
  }


  /**
   * Navigate to a coach page,
   * reset the state to be fresh beforehand
   */
  public coach(path: string, onRouter: null | undefined | (() => void) = null) {
    this.dispatch(setLoading(true));
    this.dispatch(resetCoach(false));
    this.startTransition(() => {
      this.router.push(path);
      if (onRouter) {
        onRouter();
      }
    });
  }

  /**
   * Navigate to a conference page,
   * reset the state to be fresh beforehand
   */
  public conference(path: string, onRouter: null | undefined | (() => void) = null) {
    this.dispatch(setLoading(true));
    this.dispatch(resetConference(false));
    this.startTransition(() => {
      this.router.push(path);
      if (onRouter) {
        onRouter();
      }
    });
  }

  /**
   * Navigate to a team page,
   * reset the state to be fresh beforehand
   */
  public team(path: string, onRouter: null | undefined | (() => void) = null) {
    this.dispatch(setLoading(true));
    this.dispatch(resetTeam(false));
    this.startTransition(() => {
      this.router.push(path);
      if (onRouter) {
        onRouter();
      }
    });
  }

  /**
   * Navigate to a singular game page (/sports/games/abc),
   * reset the state to be fresh beforehand
   */
  public game(path: string, onRouter: null | undefined | (() => void) = null) {
    this.dispatch(setLoading(true));
    this.dispatch(resetGame(false));
    this.startTransition(() => {
      this.router.push(path);
      if (onRouter) {
        onRouter();
      }
    });
  }

  /**
   * Navigate to the ranking page
   */
  public ranking(path: string, onRouter: null | undefined | (() => void) = null) {
    this.dispatch(setLoading(true));
    this.dispatch(resetRanking(false));
    this.startTransition(() => {
      this.router.push(path);
      if (onRouter) {
        onRouter();
      }
    });
  }

  public rankingView<K extends InitialStateKeys>(args: Pick<InitialState, K>, onRouter: null | undefined | (() => void) = null) {
    if (!this.pathName.includes('ranking')) {
      throw new Error('rankingView only usable when already navigated to ranking');
    }

    for (const key in args) {
      this.dispatch(setDataKeyPlayer({ key, value: args[key] }));
    }


    // these MUST always be set this way if the view changes
    if ('view' in args) {
      this.dispatch(resetDataKeyRanking('data'));
      this.dispatch(resetDataKeyRanking('customColumns'));
      this.dispatch(updateDataKeyDisplay({ key: 'positions', value: [] }));
      this.dispatch(resetDataKeyRanking('order'));
      this.dispatch(resetDataKeyRanking('orderBy'));
      this.dispatch(resetDataKeyRanking('tableScrollTop'));
      this.dispatch(resetDataKeyRanking('columnView'));
      this.dispatch(resetDataKeyRanking('filteredRows'));
      this.dispatch(resetDataKeyRanking('searchValue'));
    }


    this.dispatch(setDataKeyPlayer({ key: 'loadingView', value: true }));

    // player slice handles this now, but just refetch it here for stupid nextjs router
    const current = new URLSearchParams(window.location.search);
    const search = current.toString();
    const query = search ? `?${search}` : '';

    this.startTransition(() => {
      this.router.replace(`${this.pathName}${query}`);
      if (onRouter) {
        onRouter();
      }
    });
  }

  /**
   * Navigate to the games (scores) page
   */
  public games(path: string, onRouter: null | undefined | (() => void) = null) {
    this.dispatch(setLoading(true));
    this.dispatch(resetGames(false));
    this.startTransition(() => {
      this.router.push(path);
      if (onRouter) {
        onRouter();
      }
    });
  }

  /**
   * Navigate to a picks page,
   * reset the state to be fresh beforehand
   */
  public picks(path: string, onRouter: null | undefined | (() => void) = null) {
    this.dispatch(setLoading(true));
    this.dispatch(resetPicks(false));
    this.startTransition(() => {
      this.router.push(path);
      if (onRouter) {
        onRouter();
      }
    });
  }

  /**
   * Navigate to something on a player view. Must already be on player view
   */
  public picksView<K extends InitialStateKeysPicks>(args: Pick<InitialStatePicks, K>, onRouter: null | undefined | (() => void) = null) {
    if (!this.pathName.includes('picks')) {
      throw new Error('picksView only usable when already navigated to picks');
    }

    for (const key in args) {
      this.dispatch(setDataKeyPicks({ key, value: args[key] }));
    }


    // these MUST always be set this way if the view changes
    if ('view' in args) {
      // nothing here yet
    }

    this.dispatch(setDataKeyPicks({ key: 'loadingView', value: true }));


    // picks slice handles this now, but just refetch it here for stupid nextjs router
    const current = new URLSearchParams(window.location.search);
    const search = current.toString();
    const query = search ? `?${search}` : '';

    this.startTransition(() => {
      this.router.replace(`${this.pathName}${query}`);
      if (onRouter) {
        onRouter();
      }
    });
  }
}

export default Navigation;
