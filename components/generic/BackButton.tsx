'use client';
import React, { useState, useTransition} from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import BackdropLoader from './BackdropLoader';


const BackButton = () => {
  const [isPending, startTransition] = useTransition();
  const [spin, setSpin] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setSpin(true);
    startTransition(() => {
      router.back();
      setSpin(false);
    });
  };

  return (
    <>
      <IconButton color='primary' onClick = {handleClick}>
        <ArrowBackIcon  fontSize = 'small' />
      </IconButton>
      <BackdropLoader open = {(spin === true)} />
    </>
  );
}

export default BackButton;