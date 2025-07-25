'use client';

import { RefObject, useLayoutEffect, useRef, useTransition } from 'react';
import { getHeaderHeight, getMarginTop } from './Header/ClientWrapper';
import { getNavHeaderHeight } from './NavBar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/hooks/useTheme';
import Style from '@/components/utils/Style';
import Tab from '@/components/ux/buttons/Tab';
import { setDataKey } from '@/redux/features/player-slice';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';

const getSubNavHeaderHeight = () => {
  const view = useAppSelector((state) => state.playerReducer.view);
  if (view === 'gamelog') {
    return 48;
  }
  return 0;
};

export { getSubNavHeaderHeight };

const SubNavBar = ({ view }) => {
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();
  const { width } = useWindowDimensions() as Dimensions;

  const scrollRefTab = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const season = useAppSelector((state) => state.playerReducer.season);
  const player_team_seasons = useAppSelector((state) => state.playerReducer.player_team_seasons);

  const subview = useAppSelector((state) => state.playerReducer.subview) || season;
  const seasons = Object.values(player_team_seasons).map((r) => r.season);

  const scrollToElement = () => {
    scrollRefTab.current?.scrollIntoView({ inline: 'center', behavior: 'smooth' });
  };

  console.log('todo add scroll to all subnavbars / normalize component')

  useLayoutEffect(() => {
    scrollToElement();
  }, [subview]);


  let tabOrder: number[] = [];
  let tabOptions = {};

  if (view === 'gamelog') {
    tabOrder = seasons.sort((a, b) => b - a);
    tabOptions = Object.fromEntries(seasons.map((seasonNumber) => [seasonNumber, seasonNumber]));
  }

  const subHeaderHeight = getSubNavHeaderHeight();

  const minSubBarWidth = 75;

  const subHeaderStyle: React.CSSProperties = {
    height: subHeaderHeight,
    position: 'fixed',
    backgroundColor: theme.background.main,
    zIndex: Style.getStyle().zIndex.appBar,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: getHeaderHeight() + getMarginTop() + getNavHeaderHeight(),
    left: 0,
    right: 0,
    padding: '0px 20px',
  };

  const leftButtons: React.JSX.Element[] = [];
  const middleButtons: React.JSX.Element[] = [];
  const rightButtons: React.JSX.Element[] = [];

  if (tabOrder.length) {
    const tabs: React.JSX.Element[] = [];

    const handleTabClick = (e, value) => {
      const newSubview = value;

      if (newSubview !== subview) {
        dispatch(setDataKey({ key: 'subview', value: newSubview }));
        dispatch(setDataKey({ key: 'loadingView', value: true }));

        const current = new URLSearchParams(window.location.search);
        current.set('subview', newSubview);

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

    const buttonStyle: React.CSSProperties = {};

    if (width <= 425) {
      buttonStyle.minWidth = 50;
    }


    for (let i = 0; i < tabOrder.length; i++) {
      const compare = subview || season;
      let selected = false;
      if (compare) {
        selected = (+compare === +tabOptions[tabOrder[i]]);
      }

      let tabRef: RefObject<HTMLDivElement> | null = null;
      if (selected) {
        tabRef = scrollRefTab as RefObject<HTMLDivElement>;
      }

      const tab = <Tab ref = {tabRef} key = {tabOrder[i]} title = {tabOptions[tabOrder[i]]} value = {tabOrder[i]} selected = {selected} handleClick={handleTabClick} buttonStyle = {buttonStyle} />;

      tabs.push(tab);
    }


    middleButtons.push(
      <div style = {{ width: '100%', display: 'flex', justifyContent: 'center', overflowX: 'scroll', overflowY: 'hidden', scrollbarWidth: 'none' }}>
        {tabs}
      </div>,
    );
  }

  return (
    <div style = {subHeaderStyle}>
      <div style = {{ minWidth: minSubBarWidth, display: 'flex' }}>
        {leftButtons}
      </div>

      <div style = {{ minWidth: minSubBarWidth, display: 'flex' }}>
        {middleButtons}
      </div>

      <div style = {{ minWidth: minSubBarWidth, display: 'flex', justifyContent: 'end' }}>
        {rightButtons}
      </div>
    </div>
  );
};

export default SubNavBar;
