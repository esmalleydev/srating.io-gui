'use client';


import CheckIcon from '@mui/icons-material/Check';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewDayIcon from '@mui/icons-material/ViewDay';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/display-slice';
import { useTheme } from '@/components/hooks/useTheme';
import Modal from '@/components/ux/modal/Modal';
import Typography from '@/components/ux/text/Typography';
import Tile from '@/components/ux/container/Tile';


/**
 * CardPicker
 * @param  {Object} props
 * @param  {Boolean} props.open
 * @param  {Function} props.closeHandler
 * @param  {Function} props.openHandler
 * @return {<Dialog>}
 */
const CardPicker = (
  { open, closeHandler, openHandler } :
  { open: boolean; closeHandler: () => void; openHandler: () => void },
) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const selected = useAppSelector((state) => state.displayReducer.cardsView);

  const cardDisplayOptions = [
    {
      value: 'large',
      label: 'Large',
      icon: <ViewModuleIcon style = {{ color: theme.info.main }} />,
    },
    {
      value: 'compact',
      label: 'Compact',
      icon: <ViewDayIcon style = {{ color: theme.info.main }} />,
    },
    {
      value: 'super_compact',
      label: 'Super Compact',
      icon: <ViewCompactIcon style = {{ color: theme.info.main }} />,
    },
  ];

  const handleOpen = () => {
    openHandler();
  };

  const handleClose = () => {
    closeHandler();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Typography type = 'h6'>Pick card view mode</Typography>
        {cardDisplayOptions.map((option) => (
          <Tile
            key = {option.value}
            style = {{ padding: '5px 0px' }}
            icon = {option.value === selected ? <CheckIcon style={{ color: theme.success.main }} /> : option.icon}
            primary = {option.label}
            onClick={() => {
              dispatch(setDataKey({ key: 'cardsView', value: option.value }));
              handleClose();
            }}
          />
        ))}
    </Modal>
  );
};

export default CardPicker;
