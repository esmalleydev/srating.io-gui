'use client';

import React, { useTransition } from 'react';
import { Tab, Tabs } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';

const getSubNavHeaderHeight = () => 48;
export { getSubNavHeaderHeight };

const SubNavBar = ({ view, subview, tabOrder }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  let tabOptions = {};

  if (view === 'game_details') {
    tabOptions = {
      charts: 'Charts',
      boxscore: 'Boxscore',
      pbp: 'Play by play',
    };
  } else if (view === 'trends') {
    tabOptions = {
      stat_compare: 'Stat compare',
      previous_matchups: 'Prev. Matchups',
      odds: 'Odds',
      momentum: 'Momentum',
    };
  }

  const tabIndex = tabOrder.indexOf(subview);
  const [isPending, startTransition] = useTransition();


  const tabs: React.JSX.Element[] = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {(<span style = {{ fontSize: '12px' }}>{tabOptions[tabOrder[i]]}</span>)} />);
  }

  if (!tabs.length) {
    return null;
  }


  const handleTabClick = (value) => {
    const newSubview = tabOrder[value];

    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('subview', newSubview);
      const search = current.toString();
      const query = search ? `?${search}` : '';

      dispatch(setLoading(true));
      startTransition(() => {
        router.replace(`${pathName}${query}`);
      });
    }

    // router.replace({
    //   query: {...router.query, view: view},
    // });

    // todo scroll stuff?
    // if (value > 0 && props.scrollRef && props.scrollRef.current) {
    //   props.scrollRef.current.scrollTo(0, 0);
    // }
  };

  return (
    <div style = {{ marginTop: 48, display: 'flex', justifyContent: 'center' }}>
      <Tabs variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={(e, value) => { handleTabClick(value); }} indicatorColor="secondary" textColor="inherit">
        {tabs}
      </Tabs>
    </div>
  );
};

export default SubNavBar;
