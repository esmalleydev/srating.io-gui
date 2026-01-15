'use client';

import { useEffect } from 'react';
import { getStore } from './StoreProvider';
import { updateFromURL as A } from '@/redux/features/display-slice';
import { updateFromURL as B } from '@/redux/features/games-slice';
import { updateFromURL as C } from '@/redux/features/ranking-slice';
import { updateFromURL as D } from '@/redux/features/team-slice';
import { updateFromURL as E } from '@/redux/features/compare-slice';
import { updateFromURL as F } from '@/redux/features/coach-slice';
import { updateFromURL as G } from '@/redux/features/conference-slice';
import { updateFromURL as H } from '@/redux/features/game-slice';
import { updateFromURL as I } from '@/redux/features/player-slice';
import { updateFromURL as J } from '@/redux/features/fantasy-slice';
import { updateFromURL as K } from '@/redux/features/fantasy_group-slice';
import { updateFromURL as L } from '@/redux/features/payment_router-slice';
import { updateFromURL as M } from '@/redux/features/fantasy_entry-slice';
import { toast } from '@/components/utils/Toaster';


const LayoutWrapper = ({ children }) => {
  useEffect(() => {
    const handlePopState = (event) => {
      // console.log('handlePopState', event)
      const store = getStore();

      // this is dumb but needed until I remove redux
      // make sure the state is correct on forward / back buttons, reupdate it with the url
      // ex: if I go from team A to player A to Team B, then hit the back button twice to go back to team A, the state will still be from team B (for certain params like subnav views etc)
      // the state component will skip paths not in the window location pathname, so just call all of them anyways
      // todo when this is rewritten I can just programically call the function foreach state controller or something
      store.dispatch(A());
      store.dispatch(B());
      store.dispatch(C());
      store.dispatch(D());
      store.dispatch(E());
      store.dispatch(F());
      store.dispatch(G());
      store.dispatch(H());
      store.dispatch(I());
      store.dispatch(J());
      store.dispatch(K());
      store.dispatch(L());
      store.dispatch(M());
    };

    const handleOnline = () => {
      toast.success('Connected');
    };

    const handleOffline = () => {
      toast.error('Lost connection');
    };

    // Add the event listener when the component mounts
    window.addEventListener('popstate', handlePopState);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  return (
    <body>
      {children}
    </body>
  );
};

export default LayoutWrapper;
