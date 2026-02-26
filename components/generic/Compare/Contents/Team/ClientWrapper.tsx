'use client';

import { getHeaderHeight } from '../../Header/ClientWrapper';
import { getNavHeaderHeight } from '../../NavBar';

const ClientWrapper = ({ children }) => {
  const top = getHeaderHeight() + getNavHeaderHeight() + 5;
  return (
    <div style = {{ marginTop: top }}>
      {children}
    </div>
  );
};

export default ClientWrapper;
