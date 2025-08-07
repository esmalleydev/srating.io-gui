'use client';

import { getHeaderHeight } from '@/components/generic/Compare/Header/ClientWrapper';
import { getNavHeaderHeight, getSubNavHeaderHeight } from '@/components/generic/Compare/NavBar';

const ClientWrapper = ({ children }) => {
  const top = getHeaderHeight() + getNavHeaderHeight() + getSubNavHeaderHeight() + 5;
  return (
    <div style = {{ marginTop: top }}>
      {children}
    </div>
  );
};

export default ClientWrapper;
