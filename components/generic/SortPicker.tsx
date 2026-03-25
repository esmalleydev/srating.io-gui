'use client';

import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/display-slice';
import Modal from '@/components/ux/modal/Modal';
import Typography from '@/components/ux/text/Typography';
import Tile from '../ux/container/Tile';
import { useTheme } from '../hooks/useTheme';


/**
 * SortPicker
 * @param  {Object} props
 * @param  {Boolean} props.open
 * @param  {Function} props.closeHandler
 * @param  {Function} props.openHandler
 * @return {<Dialog>}
 */
const SortPicker = ({ open, openHandler, closeHandler }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.displayReducer.picksSort);

  const options = [
    {
      value: 'start_time',
      label: 'Start time',
    },
    {
      value: 'win_percentage',
      label: 'Highest win percentage',
    },
    // {
    //   'value': 'best_value',
    //   'label': 'Best value',
    // },
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
      <Typography type = 'h6'>Sort order</Typography>
      {options.map((option) => (
        <Tile
          style = {{ padding: '5px 0px' }}
          key={option.value}
          icon = {option.value === selected ? <CheckIcon /> : <CheckBoxOutlineBlankIcon style = {{ color: theme.info.main }} />}
          primary = {option.label}
          onClick={() => {
            dispatch(setDataKey({ key: 'picksSort', value: option.value }));
            handleClose();
          }}
        />
      ))}
    </Modal>
  );
};

export default SortPicker;
