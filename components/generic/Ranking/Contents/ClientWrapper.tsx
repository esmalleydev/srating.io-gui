// 'use client';

// const ClientWrapper = ({ children }) => {
//   return (
//     <div>
//       {children}
//     </div>
//   );
// };

// export default ClientWrapper;

'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { LinearProgress } from '@mui/material';
import { useEffect } from 'react';
import { setDataKey } from '@/redux/features/ranking-slice';

const ClientWrapper = (
  { children }:
  { children: React.JSX.Element },
) => {
  const dispatch = useAppDispatch();

  const loadingView = useAppSelector((state) => state.rankingReducer.loadingView);

  const paddingTop = 0;

  const heightToRemove = 0;


  useEffect(() => {
    dispatch(setDataKey({ key: 'loadingView', value: false }));
  }, [children]);

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
