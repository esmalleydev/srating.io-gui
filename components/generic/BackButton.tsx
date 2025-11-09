'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Tooltip from '@/components/ux/hover/Tooltip';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/loading-slice';


const BackButton = () => {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(setLoading(true));
    history.back();
  };

  return (
    <>
      <Tooltip onClickRemove text = {'Back'}>
        <IconButton color='primary' onClick = {handleClick}>
          <ArrowBackIcon fontSize = 'small' />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default BackButton;
