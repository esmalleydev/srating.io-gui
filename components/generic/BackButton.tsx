'use client';

import ArrowBackIcon from '@esmalley/react-material-icons/ArrowBack';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/loading-slice';
import { IconButton, Tooltip } from '@esmalley/react-material-ui';


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
