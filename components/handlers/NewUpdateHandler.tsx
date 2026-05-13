'use client';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setDataKey, setKryptos } from '@/redux/features/user-slice';
import { Button, Modal, Typography } from '@esmalley/react-material-ui';

const NewUpdateHandler = () => {
  const dispatch = useAppDispatch();
  const newUpdate = useAppSelector((state) => state.userReducer.newUpdate);

  const handle = () => {
    dispatch(setDataKey({ key: 'newUpdate', value: false }));
    dispatch(setKryptos(null));
    window.location.reload();
  };

  if (newUpdate) {
    return (
      <Modal
        open
        onClose={handle}
      >
        <Typography type = 'h6'>A new update is available</Typography>
        <Typography type = 'body1' style = {{ marginTop: 10 }}>You are running an outdated version, please refresh the page.</Typography>
        <div style = {{ textAlign: 'right', marginTop: 10 }}>
          <Button title='Refresh' ink onClick={handle} value = 'refresh' />
        </div>
      </Modal>
    );
  }

  return null;
};

export default NewUpdateHandler;
