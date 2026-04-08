'use client';

import ArrowUpwardIcon from '@esmalley/react-material-icons/ArrowUpward';
import { getHeaderHeight } from './Header/ClientWrapper';
import { getNavHeaderHeight } from './NavBar';
import Typography from '@/components/ux/text/Typography';

const Splash = () => {
  const top = getHeaderHeight() + getNavHeaderHeight() + 5;
  return (
    <div style = {{ textAlign: 'center', marginTop: top }}>
      <div><ArrowUpwardIcon style = {{ fontSize: 28 }} /></div>
      <div><Typography type='h5'>To use this tool, first add 2 teams above!</Typography></div>
    </div>
  );
};

export default Splash;
