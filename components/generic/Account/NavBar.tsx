'use client';

import { useTransition } from 'react';
import {
  Box, Tab, Tabs,
} from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';

const getNavHeaderHeight = () => {
  return 48;
};

export { getNavHeaderHeight };

const NavBar = ({ view }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const tabOrder = ['subscriptions', 'settings'];

  const tabOptions = {
    subscriptions: 'Subscriptions',
    settings: 'Settings',
  };


  const tabs: React.JSX.Element[] = [];

  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {(<span style = {{ fontSize: '12px' }}>{tabOptions[tabOrder[i]]}</span>)} />);
  }


  const handleTabClick = (e, value) => {
    const newView = tabOrder[value];

    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('view', newView);
      const search = current.toString();
      const query = search ? `?${search}` : '';

      dispatch(setLoading(true));
      startTransition(() => {
        router.replace(`${pathName}${query}`);
      });
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Tabs variant="scrollable" scrollButtons="auto" value={tabOrder.indexOf(view)} onChange={handleTabClick} indicatorColor="secondary" textColor="inherit">
        {tabs}
      </Tabs>
    </Box>
  );
};

export default NavBar;
