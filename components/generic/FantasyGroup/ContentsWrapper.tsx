'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import { useEffect } from 'react';
import { setDataKey } from '@/redux/features/fantasy_group-slice';
import { getNavHeaderHeight } from './NavBar';
import { socket } from '@/components/utils/Kontororu/Socket';
import { getStore } from '@/app/StoreProvider';
import Objector from '@/components/utils/Objector';


const ContentsWrapper = (
  { children }:
  { children: React.JSX.Element },
) => {
  const dispatch = useAppDispatch();

  const session_id = useAppSelector((state) => state.userReducer.session_id);
  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);
  const loadingView = useAppSelector((state) => state.fantasyGroupReducer.loadingView);

  const paddingTop = getNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 120;

  useEffect(() => {
    dispatch(setDataKey({ key: 'loadingView', value: false }));
  }, [children]);


  useEffect(() => {
    const messageHandler = (event: CustomEvent) => {
      if (
        event &&
        event.detail &&
        event.detail.table &&
        event.detail.id &&
        event.detail.data &&
        event.detail.table === 'fantasy_group'
      ) {
        const d: any = event.detail.data;
        const store = getStore();
        for (const key in d) {
          let value = d[key];
          if (key in store.getState().fantasyGroupReducer) {
            value = Objector.extender({}, store.getState().fantasyGroupReducer[key], value);
          }
          dispatch(setDataKey({ key, value }));
        }
      }
    };

    socket.addEventListener('message', messageHandler);

    if (session_id) {
      socket.connect(session_id);
    }

    if (fantasy_group.fantasy_group_id) {
      socket.message({ type: 'subscribe', table: 'fantasy_group', id: fantasy_group.fantasy_group_id });
    }

    return () => {
      if (fantasy_group.fantasy_group_id) {
        socket.message({ type: 'unsubscribe', table: 'fantasy_group', id: fantasy_group.fantasy_group_id });
      }
      socket.removeEventListener('message', messageHandler);
    };
  }, [session_id, fantasy_group.fantasy_group_id]);


  return (
    <div style = {{ paddingTop, maxWidth: 1200, margin: 'auto' }}>
      {
      loadingView ?
        <div style = {{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: `calc(100vh - ${heightToRemove}px)`,
        }}>
          <LinearProgress color = 'secondary' style={{ width: '50%' }} />
        </div>
        : children
      }
    </div>
  );
};

export default ContentsWrapper;
