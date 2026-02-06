'use client';

import Style from '@/components/utils/Style';
import BackButton from '../BackButton';
import Objector from '@/components/utils/Objector';
import { useTheme } from '@/components/hooks/useTheme';


const getNavHeaderHeight = () => {
  return 32;
};

export { getNavHeaderHeight };




const NavBar = () => {
  const theme = useTheme();

  const divStyle = Objector.extender(
    Style.getNavBar(),
    {
      justifyContent: 'space-between',
      backgroundColor: theme.background.main,
      padding: '0px 10px',
      height: getNavHeaderHeight(),
      alignItems: 'center',
    },
  );


  return (
    <>
      <div className={Style.getStyleClassName(divStyle)}>
        <div><BackButton /></div>
        <div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
