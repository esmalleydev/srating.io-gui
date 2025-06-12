'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getNavHeaderHeight } from './NavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { LinearProgress } from '@mui/material';
import { useEffect } from 'react';
import { setDataKey } from '@/redux/features/player-slice';
import { getSubNavHeaderHeight } from './SubNavbar';


const ContentsWrapper = (
  { children }:
  { children: React.JSX.Element },
) => {
  const dispatch = useAppDispatch();

  const loadingView = useAppSelector((state) => state.playerReducer.loadingView);

  const paddingTop = getNavHeaderHeight() + getSubNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 120;

  useEffect(() => {
    dispatch(setDataKey({ key: 'loadingView', value: false }));
  }, [children]);


  return (
    <div style = {{ paddingTop }}>
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
