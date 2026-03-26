
'use client';

import { useTheme } from '@/components/ux/contexts/themeContext';
import LinearProgress from '@/components/ux/loading/LinearProgress';
import { useAppSelector } from '@/redux/hooks';

const ClientWrapper = (
  { children }:
  { children: React.JSX.Element },
) => {
  const theme = useTheme();
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
          <LinearProgress color = {theme.secondary.main} containerStyle={{ width: '50%' }} />
        </div>
        : children
      }
    </div>
  );
};

export default ClientWrapper;
