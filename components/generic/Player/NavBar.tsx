'use client';

import React, { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getHeaderHeight, getMarginTop } from './Header/ClientWrapper';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/player-slice';
import { useTheme } from '@/components/hooks/useTheme';
import Tab from '@/components/ux/buttons/Tab';
import Style from '@/components/utils/Style';
import SubNavBar from './SubNavbar';


const getNavHeaderHeight = () => {
  return 42;
};

export { getNavHeaderHeight };

const NavBar = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();

  const view = useAppSelector((state) => state.playerReducer.view) || 'stats';

  const tabOrder = ['stats', 'gamelog', 'trends'];

  const tabOptions = {
    stats: 'Stats',
    gamelog: 'Gamelog',
    trends: 'Trends',
  };

  const backgroundColor = theme.mode === 'dark' ? theme.grey[900] : theme.primary.light;

  const handleTabClick = (e, value) => {
    const newView = value;

    if (newView !== view) {
      dispatch(setDataKey({ key: 'view', value: newView }));
      dispatch(setDataKey({ key: 'subview', value: null }));
      dispatch(setDataKey({ key: 'loadingView', value: true }));

      const current = new URLSearchParams(window.location.search);
      current.set('view', newView);
      current.delete('subview');

      window.history.replaceState(null, '', `?${current.toString()}`);

      // use pushState if we want to add to back button history
      // window.history.pushState(null, '', `?${current.toString()}`);

      const search = current.toString();
      const query = search ? `?${search}` : '';

      startTransition(() => {
        router.replace(`${pathName}${query}`);
      });
    }
  };

  const tabs: React.JSX.Element[] = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(
      <Tab key = {tabOrder[i]} value = {tabOrder[i]} selected = {tabOrder[i] === view} title = {tabOptions[tabOrder[i]]} containerStyle={{ backgroundColor }} handleClick = {handleTabClick} />,
    );
  }

  const divStyle = Style.getStyleClassName({
    ...Style.getNavBar(),
    backgroundColor,
    top: getMarginTop() + getHeaderHeight(),
  });

  return (
    <>
      <div className={divStyle}>
        {tabs}
      </div>
      <SubNavBar view = {view} />
    </>
  );
};

export default NavBar;
