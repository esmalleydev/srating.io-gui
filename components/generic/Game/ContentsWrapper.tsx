'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getNavHeaderHeight, getSubNavHeaderHeight } from './NavBar';
import { footerNavigationHeight } from '@/components/generic/FooterNavigation';
import { headerBarHeight } from '@/components/generic/Header';
import { useEffect } from 'react';
import { setDataKey } from '@/redux/features/game-slice';
import LinearProgress from '@/components/ux/loading/LinearProgress';
import { useTheme } from '@/components/ux/contexts/themeContext';


const ContentsWrapper = (
  { children }:
  { children: React.JSX.Element },
) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const loadingView = useAppSelector((state) => state.gameReducer.loadingView);

  const paddingTop = getNavHeaderHeight() + getSubNavHeaderHeight();

  const heightToRemove = paddingTop + footerNavigationHeight + headerBarHeight + 120;

  useEffect(() => {
    dispatch(setDataKey({ key: 'loadingView', value: false }));
  }, [children]);


  return (
    <div>
      {
      loadingView ?
        <div style = {{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: `calc(100vh - ${heightToRemove}px)`,
        }}>
          <LinearProgress color = {theme.secondary.main} containerStyle={{ width: '50%' }} />
        </div>
        : children
      }
    </div>
  );
};

export default ContentsWrapper;
