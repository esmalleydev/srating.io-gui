'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { setDataKey } from '@/redux/features/fantasy_entry-slice';
import { getNavHeaderHeight } from './NavBar';
import { useClientAPI } from '@/components/clientAPI';
import Typography from '@/components/ux/text/Typography';
import { FantasyEntryLoadData, handleLoad } from './ReduxWrapper';



/**
 * The main wrapper div for all the contents
 */
const Contents = ({ children }): React.JSX.Element => {
  const paddingTop = getNavHeaderHeight();
  return (
    <div style = {{ paddingTop, margin: 'auto' }}>
      {children}
    </div>
  );
};

const ContentsWrapper = (
  { children }:
  { children: React.JSX.Element },
) => {
  const dispatch = useAppDispatch();

  const fantasy_entry = useAppSelector((state) => state.fantasyEntryReducer.fantasy_entry);
  const loadingView = useAppSelector((state) => state.fantasyEntryReducer.loadingView);

  const [request, setRequest] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [canView, setCanView] = useState(true);

  const paddingTop = getNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 120;

  useEffect(() => {
    dispatch(setDataKey({ key: 'loadingView', value: false }));
  }, [children]);


  const load = () => {
    if (request) {
      return;
    }
    setRequest(true);
    useClientAPI({
      class: 'fantasy_entry',
      function: 'load',
      arguments: {
        fantasy_entry_id: fantasy_entry.fantasy_entry_id,
      },
    }).then((data: FantasyEntryLoadData) => {
      setLoaded(true);
      if (!data || data.error) {
        setCanView(false);
      } else {
        handleLoad({
          dispatch,
          data,
        });
      }
    }).catch((err) => {
      // nothing for now
    });
  };

  if (!request && fantasy_entry.fantasy_entry_id) {
    load();
  }

  if (!canView) {
    return (
      <Contents>
        <Typography style = {{ textAlign: 'center' }} type = 'h5'>You do not have permission to view this entry!</Typography>
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
