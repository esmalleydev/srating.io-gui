'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@/components/ux/hover/Tooltip';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/loading-slice';
import IconButton from '../ux/buttons/IconButton';


const BackButton = () => {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(setLoading(true));
    history.back();
  };

  return (
    <>
      <Tooltip onClickRemove text = {'Back'}>
        <IconButton onClick = {handleClick} value = 'back' icon = {<ArrowBackIcon fontSize = 'small' />} />
      </Tooltip>
    </>
  );
};

export default BackButton;
