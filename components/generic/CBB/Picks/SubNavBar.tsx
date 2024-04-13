'use client';
import React, { useState, useTransition } from 'react';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Tab, Tabs, useTheme } from '@mui/material';
import { getBreakPoint } from '@/components/generic/DateAppBar';
// import ConferencePicker from '@/components/generic/CBB/ConferencePicker';
// import AdditionalOptions from '@/components/generic/CBB/Picks/AdditionalOptions';
// import StatusPicker from '@/components/generic/CBB/StatusPicker';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import BackdropLoader from '@/components/generic/BackdropLoader';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setScrollTop } from '@/redux/features/picks-slice';
// import ViewPicker from './ViewPicker';
// import RefreshCounter from './RefreshCounter';

const getHeaderHeight = () => {
  return 48;
};


export { getHeaderHeight };

// todo update the calc to use the billing locked component

const SubNavBar = ({ view }) => {
  const theme = useTheme();
  const { width }= useWindowDimensions() as Dimensions;
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();


  let tabOptions = {
    'stats': 'Stats',
    'calculator': 'Calculator',
    'picks': 'Picks',
  };

  let tabOrder = ['picks', 'calculator', 'stats'];

  const [tabIndex, setTabIndex] = useState(tabOrder.indexOf(view));
  const [showLockedDialog, setShowLockedDialog] = useState(false);
  const [spin, setSpin] = useState(false);
  const [isPending, startTransition] = useTransition();

  const calcAccess = useAppSelector(state => state.userReducer.isValidSession);
  // const picksData = useAppSelector(state => state.picksReducer.picks);

  // let calcAccess = false;
  // for (let cbb_game_id in picksData) {
  //   if (picksData[cbb_game_id].home_team_rating !== null && picksData[cbb_game_id].away_team_rating !== null) {
  //     calcAccess = true;
  //     break;
  //   }
  // }

  const subHeaderHeight = getHeaderHeight();
  let subHeaderTop = 112;
  let minSubBarWidth = 75;

  if (width < getBreakPoint()) {
    minSubBarWidth = 0;
    subHeaderTop = 104;
  }


  const subHeaderStyle: React.CSSProperties = {
    'height': subHeaderHeight,
    'position': 'fixed',
    'backgroundColor': theme.palette.background.default,
    'zIndex': 1100,
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'top': subHeaderTop,
    'left': 0,
    'right': 0,
  };

  let tabs: React.JSX.Element[] = [];
  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {(<span style = {{'fontSize': '12px'}}>{tabOptions[tabOrder[i]]}</span>)} />);
  }

  const handleSubscribe = () => {
    setSpin(true);
    startTransition(() => {
      router.push('/pricing');
      setSpin(false);
    });
  };

  const handleLiveWinRate = () => {
    setSpin(true);
    setShowLockedDialog(false);
    startTransition(() => {
      router.push('/cbb/picks?view=stats');
      setSpin(false);
    });
  };

  const handleCloseLockedDialog = () => {
    setShowLockedDialog(false);
  };

  const handleTabClick = (e, value) => {
    setShowLockedDialog(false);
    if (value === 1 && !calcAccess) {
      setShowLockedDialog(true);
      return;
    }
    
    setTabIndex(value);
    
    view = tabOrder[value];

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('view', view);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    
    setSpin(true);
    startTransition(() => {
      router.replace(`${pathName}${query}`);
      dispatch(setScrollTop(0));
      setSpin(false);
    });
  }


  return (
    <div style = {subHeaderStyle}>
      <BackdropLoader open = {spin} />

      <Box display="flex" justifyContent="center" /*sx = {{'position': 'sticky', 'top': 100}}*/>
        <Tabs variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={handleTabClick} indicatorColor="secondary" textColor="inherit">
          {tabs}
        </Tabs>
      </Box>

      {/* <div style = {{'minWidth': minSubBarWidth, 'display': 'flex', 'alignItems': 'center'}}>
        <AdditionalOptions />
      </div> */}

      <Dialog
        open={showLockedDialog}
        onClose={handleCloseLockedDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Subscription required'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Subscribe for just $5 per month to get access to the betting calculator!
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            <Link style = {{'cursor': 'pointer'}} underline="hover" onClick = {handleLiveWinRate}>View the live win rate</Link>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLockedDialog}>Maybe later</Button>
          <Button onClick={handleSubscribe} autoFocus>
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SubNavBar;