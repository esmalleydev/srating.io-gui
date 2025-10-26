'use client';

import { setLoading } from '@/redux/features/display-slice';
import { InitialState, InitialStateKeys, resetDataKey as resetDataKeyPlayer, reset as resetPlayer, setDataKey as setDataKeyPlayer } from '@/redux/features/player-slice';
import { reset as resetCoach } from '@/redux/features/coach-slice';
import { reset as resetConference } from '@/redux/features/conference-slice';
import { reset as resetTeam } from '@/redux/features/team-slice';
import { reset as resetGame } from '@/redux/features/games-slice';
import { useAppDispatch } from '@/redux/hooks';
import { AppDispatch } from '@/redux/store';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { usePathname, useRouter } from 'next/navigation';
import { TransitionStartFunction, useTransition } from 'react';

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

  /**
   * Navigate to a player page,
   * reset the state to be fresh beforehand
   */
  public player(path: string, onRouter: null | undefined | (() => void) = null) {
    this.dispatch(setLoading(true));
    this.dispatch(resetPlayer());
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
    this.dispatch(resetCoach());
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
    this.dispatch(resetConference());
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
    this.dispatch(resetTeam());
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
  public games(path: string, onRouter: null | undefined | (() => void) = null) {
    this.dispatch(setLoading(true));
    this.dispatch(resetGame());
    this.startTransition(() => {
      this.router.push(path);
      if (onRouter) {
        onRouter();
      }
    });
  }
}

export default Navigation;
