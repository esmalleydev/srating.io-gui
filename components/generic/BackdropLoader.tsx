import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from '@/redux/hooks';


const BackdropLoader = ({ open }: { open: boolean}) => {

  // const loading = useAppSelector(state => state.displayReducer.loading);


  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default BackdropLoader;




