'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import OpenInFullIcon from '@esmalley/react-material-icons/OpenInFull';
import CloseFullscreenIcon from '@esmalley/react-material-icons/CloseFullscreen';
import { setDataKey } from '@/redux/features/ranking-slice';
import { Style } from '@esmalley/ts-utils';
import { IconButton, Tooltip, useTheme } from '@esmalley/react-material-ui';

const FloatingButtons = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const tableFullscreen = useAppSelector((state) => state.rankingReducer.tableFullscreen);

  const handleFullscreen = () => {
    dispatch(setDataKey({ key: 'tableFullscreen', value: !(tableFullscreen) }));
  };


  return (
    <div style = {{ position: 'absolute', bottom: 70, right: 15 }}>
      <Tooltip position = 'top' text={`${tableFullscreen ? 'Minimize' : 'Full screen'} table`}>
        <IconButton
          containerStyle = {{
            zIndex: Style.getZIndex().fab,
            backgroundColor: theme.secondary.main,
            boxShadow: Style.getShadow(6),
            '&:hover': {
              backgroundColor: (theme.mode === 'dark' ? theme.secondary.dark : theme.secondary.dark),
            },
          }}
          style = {{ color: theme.mode === 'dark' ? '#000' : '#fff' }}
          type = 'circle'
          value = 'full-screen'
          onClick = {handleFullscreen}
          icon={tableFullscreen ? <CloseFullscreenIcon style = {{ fontSize: 24 }} /> : <OpenInFullIcon style = {{ fontSize: 24 }} />}
        />
      </Tooltip>
    </div>
  );
};

export default FloatingButtons;
