'use client';

import { setLoading } from '@/redux/features/display-slice';
import { reset as resetPlayer } from '@/redux/features/player-slice';
import { reset as resetCoach } from '@/redux/features/coach-slice';
import { reset as resetConference } from '@/redux/features/conference-slice';
import { reset as resetTeam } from '@/redux/features/team-slice';
import { reset as resetGame } from '@/redux/features/games-slice';
import { useAppDispatch } from '@/redux/hooks';
import { AppDispatch } from '@/redux/store';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { TransitionStartFunction, useTransition } from 'react';

// todo remove nextjs router :D

class Navigation {
  constructor() {
    this.dispatch = useAppDispatch();
    const [isPending, startTransition] = useTransition();
    this.isPending = isPending;
    this.startTransition = startTransition;
    this.router = useRouter();
  }

  private dispatch: AppDispatch;

  private isPending: boolean;

  private startTransition: TransitionStartFunction;

  private router: AppRouterInstance;

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
