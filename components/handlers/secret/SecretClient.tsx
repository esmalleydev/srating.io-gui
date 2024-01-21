'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSecret } from '@/redux/features/user-slice';


const SecretClient = ({ secret }) => {
  const dispatch = useAppDispatch();
  const userSlice = useAppSelector(state => state.userReducer.value);


  if (userSlice.secret_id !== secret) {
    dispatch(setSecret(secret));
  }

  return null;
}

export default SecretClient;
