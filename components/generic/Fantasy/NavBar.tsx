'use client';


import Navigation from '@/components/helpers/Navigation';
import Style from '@/components/utils/Style';
import Button from '@/components/ux/buttons/Button';
import BackButton from '../BackButton';
import { useAppSelector } from '@/redux/hooks';
import Typography from '@/components/ux/text/Typography';
import { useState } from 'react';
import AccountHandler from '../AccountHandler';
import Objector from '@/components/utils/Objector';
import { useTheme } from '@/components/hooks/useTheme';


const getNavHeaderHeight = () => {
  return 42;
};

export { getNavHeaderHeight };

const NavBar = () => {
  const theme = useTheme();
  const view = useAppSelector((state) => state.fantasyReducer.view);
  const session_id = useAppSelector((state) => state.userReducer.session_id);
  const [showModal, setShowModal] = useState(false);
  const navigation = new Navigation();

  // const divStyle = Style.getStyleClassName({
  //   display: 'flex',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   padding: '5px 10px',
  // });

  const divStyle = Objector.extender(
    Style.getNavBar(),
    {
      justifyContent: 'space-between',
      backgroundColor: theme.background.main
    }
  );

  const handleCreate = (e) => {
    if (!session_id) {
      setShowModal(true);
      return;
    }
    navigation.fantasyView({ view: 'create' });
  };

  const getHeaderText = () => {
    if (view === 'home') {
      return 'Fantasy groups and rankings';
    }

    if (view === 'create') {
      return 'Create a fantasy group';
    }

    return null;
  };


  return (
    <>
      <div className={Style.getStyleClassName(divStyle)}>
        <div style = {{ display: 'flex' }}>{view !== 'home' ? <BackButton /> : ''}</div>
        <div>{getHeaderText() ? <Typography type = 'h5'>{getHeaderText()}</Typography> : ''}</div>
        <div>{view === 'home' ? <Button title = 'Create fantasy group' value = 'create' handleClick = {handleCreate} /> : ''}</div>
      </div>
      <AccountHandler open = {showModal} closeHandler={() => setShowModal(false)} loginCallback={handleCreate} title='Account required to create a fantasy group' />
    </>
  );
};

export default NavBar;
