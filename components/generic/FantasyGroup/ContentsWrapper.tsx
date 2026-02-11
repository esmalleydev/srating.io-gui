'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { InitialState, setDataKey } from '@/redux/features/fantasy_group-slice';
import { getNavHeaderHeight } from './NavBar';
import { socket } from '@/components/utils/Kontororu/Socket';
import { getStore } from '@/app/StoreProvider';
import Objector from '@/components/utils/Objector';
import { useClientAPI } from '@/components/clientAPI';
import { FantasyGroupLoadData, handleLoad } from './ReduxWrapper';
import Typography from '@/components/ux/text/Typography';

import { toast } from '@/components/utils/Toaster';

// TODO
// pending invites does not update from broadcast when someone joins
// invite field input annoying on mouse up after selecting to clear input if fired outside modal it closes the modal
// auto create first entry if free group?
// limt players by position? only 3 of center etc?
// select input in ios click then click out then click again, does not open


/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  const paddingTop = getNavHeaderHeight();
  return (
    <div style = {{ paddingTop, maxWidth: 1200, margin: 'auto' }}>
      {children}
    </div>
  );
};

const ContentsWrapper = (
  { children }:
  { children: React.JSX.Element },
) => {
  const dispatch = useAppDispatch();

  const online = useAppSelector((state) => state.generalReducer.online);
  const session_id = useAppSelector((state) => state.userReducer.session_id);
  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);
  const loadingView = useAppSelector((state) => state.fantasyGroupReducer.loadingView);

  const [request, setRequest] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [canView, setCanView] = useState(true);

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
          dispatch(setDataKey({ key: key as keyof InitialState, value }));
        }

        if (
          event.detail.toast &&
          event.detail.toast.table &&
          event.detail.toast.id
        ) {
          let object = event.detail.toast.table in event.detail.data && event.detail.toast.id in event.detail.data[event.detail.toast.table] ? event.detail.data[event.detail.toast.table] : null;
          if (
            !object &&
            `${event.detail.toast.table}s` in event.detail.data &&
            event.detail.toast.id in event.detail.data[`${event.detail.toast.table}s`]
          ) {
            object = event.detail.data[`${event.detail.toast.table}s`][event.detail.toast.id];
          }

          if (
            event.detail.toast.table === 'fantasy_draft_order' &&
            object !== null &&
            object.picked === 1
          ) {
            const fantasy_entry = (
              object.fantasy_entry_id in store.getState().fantasyGroupReducer.fantasy_entrys ?
                store.getState().fantasyGroupReducer.fantasy_entrys[object.fantasy_entry_id]
                : null
            );

            const fantasy_entry_player = (
              object.fantasy_entry_player_id in store.getState().fantasyGroupReducer.fantasy_entry_players ?
                store.getState().fantasyGroupReducer.fantasy_entry_players[object.fantasy_entry_player_id]
                : null
            );

            const player_team_season = (
              fantasy_entry_player && fantasy_entry_player.player_team_season_id in store.getState().fantasyGroupReducer.player_team_seasons ?
                store.getState().fantasyGroupReducer.player_team_seasons[fantasy_entry_player.player_team_season_id]
                : null
            );

            const player = (
              player_team_season &&
              player_team_season.player_id in store.getState().fantasyGroupReducer.players ?
                store.getState().fantasyGroupReducer.players[player_team_season.player_id]
                : null
            );

            toast.info(`${fantasy_entry?.name || 'UNK'} picked ${player ? `${player.first_name} ${player.last_name}` : 'UNK'}`);
          }
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
  }, [session_id, fantasy_group.fantasy_group_id, online]);

  useEffect(() => {
    if (online && fantasy_group.fantasy_group_id) {
      setRequest(false);
      load();
    }
  }, [online]);


  const load = () => {
    if (request) {
      return;
    }
    setRequest(true);
    useClientAPI({
      class: 'fantasy_group',
      function: 'load',
      arguments: {
        fantasy_group_id: fantasy_group.fantasy_group_id,
      },
    }).then((fantasyData: FantasyGroupLoadData) => {
      setLoaded(true);
      if (!fantasyData || fantasyData.error) {
        setCanView(false);
      } else {
        handleLoad({
          dispatch,
          data: fantasyData,
        });
      }
    }).catch((err) => {
      // nothing for now
    });
  };

  if (!request && fantasy_group.fantasy_group_id) {
    load();
  }

  if (!canView) {
    return (
      <Contents>
        <Typography style = {{ textAlign: 'center' }} type = 'h5'>You do not have permission to view this group!</Typography>
      </Contents>
    );
  }

  return (
    <Contents>
      {
      loadingView || !loaded ?
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
    </Contents>
  );
};

export default ContentsWrapper;
