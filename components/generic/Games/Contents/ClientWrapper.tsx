'use client';

import { Profiler } from 'react';

const ClientWrapper = ({ children }) => {
  return (
    <Profiler id="Games.Contents.ClientWrapper" onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime) => {
      console.log(id, phase, actualDuration);
    }}>
    <div>
      {children}
    </div>
    </Profiler>
  );
};

export default ClientWrapper;
