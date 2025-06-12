import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from '@/redux/hooks';


const Spinner = () => {
  const loading = useAppSelector((state) => state.displayReducer.loading);
  // console.log('spinner')
  // console.log(loading)

  return (
    <Backdrop sx={{ color: '#fff', zIndex: 9000 /*(theme) => theme.zIndex.drawer + 1*/ }} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default Spinner;




