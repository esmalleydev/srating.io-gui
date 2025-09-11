'use client';

import { useTransition } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { setLoading } from '@/redux/features/display-slice';
import { useAppDispatch } from '@/redux/hooks';
import Tooltip from '@/components/ux/hover/Tooltip';


const BackButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.back();
    });
  };

  return (
    <>
      <Tooltip text = {'Back'}>
        <IconButton color='primary' onClick = {handleClick}>
          <ArrowBackIcon fontSize = 'small' />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default BackButton;
