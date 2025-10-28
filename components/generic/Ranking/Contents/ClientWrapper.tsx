
'use client';

import { useAppSelector } from '@/redux/hooks';
import { LinearProgress } from '@mui/material';

const ClientWrapper = (
  { children }:
  { children: React.JSX.Element },
) => {
  const loadingView = useAppSelector((state) => state.rankingReducer.loadingView);

  const paddingTop = 0;

  // todo get the actual height
  const heightToRemove = 190;


  return (
    <div style = {{ paddingTop }}>
      {
      loadingView ?
        <div style = {{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: `calc(100vh - ${heightToRemove}px)`,
        }}>
          <LinearProgress color = 'secondary' style={{ width: '50%' }} />
        </div>
        : children
      }
    </div>
  );
};

export default ClientWrapper;
