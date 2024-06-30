'use client';
import React, { useState, useTransition } from 'react';
import { AppBar, Tab, Tabs, useTheme } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getHeaderHeight, getMarginTop } from './Header/ClientWrapper';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';


const getNavHeaderHeight = () => {
  return 48;
};

export { getNavHeaderHeight};

const NavBar = ({ view, tabOrder}) => {
  // const CBB = new HelperCBB();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  let tabOptions = {
    'teams': 'Teams',
  };
    
    
  const [tabIndex, setTabIndex] = useState(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0);
  const [isPending, startTransition] = useTransition();
    
    
  let tabs: React.JSX.Element[] = [];
    
  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {tabOptions[tabOrder[i]]} />);
  }
    
    
  const handleTabClick = (value) => {
    setTabIndex(value);
    
    view = tabOrder[value];
    
    if (searchParams) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('view', view);
      const search = current.toString();
      const query = search ? `?${search}` : "";
    
      dispatch(setLoading(true));
      startTransition(() => {
        router.replace(`${pathName}${query}`);
      });
    }
    
    // router.replace({
    //   query: {...router.query, view: view},
    // });
      
    // todo scroll stuff
    // if (value > 0 && props.scrollRef && props.scrollRef.current) {
    //   props.scrollRef.current.scrollTo(0, 0);
    // }
  };

  return (
    <>
      <AppBar position="sticky" style = {{'backgroundColor': theme.palette.mode == 'dark' ? theme.palette.grey[900] : theme.palette.primary.light, 'top': getMarginTop() + getHeaderHeight(), 'position': 'fixed'}}>
        <Tabs /*todo if width less than x variant="scrollable" scrollButtons="auto"*/ value={tabIndex} onChange={(e, value) => {handleTabClick(value)}} centered indicatorColor="secondary" textColor="inherit">
          {tabs}
        </Tabs>
      </AppBar>
    </>
  );
}

export default NavBar;
