'use client';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import Alert from '@/components/generic/Alert';
import { setKryptos, setNewUpdate } from '@/redux/features/user-slice';

const NewUpdateHandler = () => {
  const dispatch = useAppDispatch();
  const newUpdate = useAppSelector((state) => state.userReducer.newUpdate);

  const handle = () => {
    dispatch(setNewUpdate(false));
    dispatch(setKryptos(null));
    window.location.reload();
  };

  if (newUpdate) {
    return <Alert open={true} title={'A new update is available.'} message={'You are running an outdated version, please refresh the page.'} confirmText='Refresh' confirm={handle} />;
  }

  return null;
};

export default NewUpdateHandler;
