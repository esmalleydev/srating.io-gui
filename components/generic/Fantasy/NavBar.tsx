'use client';

import Style from '@/components/utils/Style';
import BackButton from '../BackButton';
import { useAppSelector } from '@/redux/hooks';
import Typography from '@/components/ux/text/Typography';
import Objector from '@/components/utils/Objector';
import { useTheme } from '@/components/hooks/useTheme';


const getNavHeaderHeight = () => {
  return 42;
};

export { getNavHeaderHeight };

const NavBar = () => {
  const theme = useTheme();
  const view = useAppSelector((state) => state.fantasyReducer.view);
  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization) || {};


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
      backgroundColor: theme.background.main,
    },
  );


  const getHeaderText = () => {
    if (view === 'home') {
      return `${organizations[organization_id].name} fantasy leagues`;
    }

    if (view === 'create') {
      return 'Create a fantasy league';
    }

    return null;
  };

  const show_back = (view !== 'home' && view !== 'create');


  return (
    <>
      <div className={Style.getStyleClassName(divStyle)}>
        <div style = {{ display: 'flex' }}>{show_back ? <BackButton /> : ''}</div>
        <div>{getHeaderText() ? <Typography type = 'h5'>{getHeaderText()}</Typography> : ''}</div>
        <div></div>
      </div>
    </>
  );
};

export default NavBar;
