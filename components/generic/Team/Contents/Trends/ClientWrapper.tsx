'use client';

const ClientWrapper = ({ children }) => {
  return (
    <div style={{ padding: 5 }}>
      {children}
    </div>
  );
};

export default ClientWrapper;
