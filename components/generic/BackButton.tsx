'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Tooltip from '@/components/ux/hover/Tooltip';


const BackButton = () => {
  const handleClick = () => {
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
