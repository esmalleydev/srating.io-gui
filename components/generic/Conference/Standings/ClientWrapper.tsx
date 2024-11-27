'use client';

import { getMarginTop } from '../Header/ClientWrapper';

const ClientWrapper = ({ children }) => {
  const top = getMarginTop();
  return (
    <div style = {{ marginTop: top }}>
      {children}
    </div>
  );
};

export default ClientWrapper;
