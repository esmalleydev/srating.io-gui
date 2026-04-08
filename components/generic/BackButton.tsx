'use client';

import ArrowBackIcon from '@esmalley/react-material-icons/ArrowBack';
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
        <IconButton onClick = {handleClick} value = 'back' icon = {<ArrowBackIcon style = {{ fontSize: 24 }} />} />
      </Tooltip>
    </>
  );
};

export default BackButton;
