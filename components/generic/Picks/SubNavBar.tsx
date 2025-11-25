'use client';

import React, { useState, useTransition } from 'react';
import { getBreakPoint, getMarginTop, getDateBarHeight } from '@/components/generic/DateBar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/loading-slice';
import { useTheme } from '@/components/hooks/useTheme';
import Style from '@/components/utils/Style';
import Modal from '@/components/ux/container/Modal';
import Tab from '@/components/ux/buttons/Tab';
import Typography from '@/components/ux/text/Typography';
import Button from '@/components/ux/buttons/Button';
import Navigation from '@/components/helpers/Navigation';

const getHeaderHeight = () => {
  return 48;
};


export { getHeaderHeight };

const SubNavBar = () => {
  const navigation = new Navigation();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const view = useAppSelector((state) => state.picksReducer.view);

  const tabOptions = {
    stats: 'Stats',
    calculator: 'Calculator',
    picks: 'Picks',
  };

  const tabOrder = ['picks', 'calculator', 'stats'];

  const [showLockedDialog, setShowLockedDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  const calcAccess = useAppSelector((state) => state.userReducer.isValidSession);

  const subHeaderHeight = getHeaderHeight();
  const subHeaderTop = getMarginTop() + getDateBarHeight();

  const subHeaderStyle: React.CSSProperties = {
    height: subHeaderHeight,
    position: 'fixed',
    backgroundColor: theme.background.main,
    zIndex: Style.getStyle().zIndex.appBar,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: subHeaderTop,
    left: 0,
    right: 0,
  };

  const tabs: React.JSX.Element[] = [];
  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} selected = {tabOrder[i] === view} title = {tabOptions[tabOrder[i]]} value = {tabOrder[i]} handleClick={(e) => handleTabClick(e, tabOrder[i])} />);
  }

  const handleSubscribe = () => {
    dispatch(setLoading(true));
    startTransition(() => {
      navigation.getRouter().push('/pricing');
    });
  };


  const handleLiveWinRate = () => {
    dispatch(setLoading(true));
    setShowLockedDialog(false);
    handleTabClick(null, 'stats');
  };

  const handleCloseLockedDialog = () => {
    setShowLockedDialog(false);
  };

  const handleTabClick = (e, value) => {
    setShowLockedDialog(false);
    if ((value === 'calculator' || value === 'picks') && !calcAccess) {
      setShowLockedDialog(true);
      return;
    }

    const newView = value;

    navigation.picksView({
      view: newView,
      scrollTop: 0,
    });
  };

  const divStyle = Style.getStyleClassName({
    ...Style.getNavBar(),
  });


  return (
    <div style = {subHeaderStyle}>

      <div className={divStyle}>
        {tabs}
      </div>

      {/* <div style = {{'minWidth': minSubBarWidth, 'display': 'flex', 'alignItems': 'center'}}>
        <AdditionalOptions />
      </div> */}

      <Modal
        open={showLockedDialog}
        onClose={handleCloseLockedDialog}
      >
        <Typography type = 'h6'>Subscription required</Typography>
        <Typography type = 'body1'>Subscribe for just $5 per month to get access to the betting calculator!</Typography>
        <Typography type = 'a' onClick = {handleLiveWinRate}>View the live win rate</Typography>
        <div style = {{ textAlign: 'right' }}>
          <Button handleClick={handleCloseLockedDialog} title = {'Maybe later'} ink value = 'later' />
          <Button handleClick={handleSubscribe} autoFocus title = {'Subscribe'} value = 'subscribe' />
        </div>
      </Modal>
    </div>
  );
};

export default SubNavBar;
