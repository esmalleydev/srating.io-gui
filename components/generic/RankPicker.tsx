'use client';

import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Organization from '@/components/helpers/Organization';
import { setDataKey } from '@/redux/features/display-slice';
import Typography from '../ux/text/Typography';
import { useTheme } from '@/components/ux/contexts/themeContext';
import Modal from '../ux/modal/Modal';
import Tile from '../ux/container/Tile';


/**
 * RankPicker
 */
const RankPicker = (
  { open, closeHandler, openHandler } :
  { open: boolean; closeHandler: () => void; openHandler: () => void },
) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const selected = useAppSelector((state) => state.displayReducer.rank);
  const isCBB = Organization.isCBB();

  let rankDisplayOptions = [
    {
      value: 'rank',
      label: 'sRating',
    },
    {
      value: 'ap_rank',
      label: 'AP',
    },
    {
      value: 'elo_rank',
      label: 'sRating Elo',
    },
  ];

  // if (isCBB) {
  //   rankDisplayOptions = rankDisplayOptions.concat([
  //     {
  //       value: 'kenpom_rank',
  //       label: 'Kenpom',
  //     },
  //     {
  //       value: 'srs_rank',
  //       label: 'SRS',
  //     },
  //     {
  //       value: 'net_rank',
  //       label: 'NET',
  //     },
  //   ]);
  // }

  rankDisplayOptions = rankDisplayOptions.concat([
    {
      value: 'coaches_rank',
      label: 'Coaches Poll',
    },
  ]);

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
      aria-describedby="alert-dialog-rank-picker-description"
    >
      <Typography type = 'h6'>Rank metric</Typography>
      <Typography type = 'caption' style = {{ color: theme.text.secondary }}>Pick which ranking # to display next to a team.</Typography>
      {rankDisplayOptions.map((rankDisplayOption) => (
        <Tile
          style = {{ padding: '5px 0px' }}
          key={rankDisplayOption.value}
          icon = {rankDisplayOption.value === selected ? <CheckIcon /> : <CheckBoxOutlineBlankIcon style = {{ color: theme.info.main }} />}
          primary = {rankDisplayOption.label}
          onClick={() => {
            dispatch(setDataKey({ key: 'rank', value: rankDisplayOption.value }));
            handleClose();
          }}
        />
      ))}
    </Modal>
  );
};

export default RankPicker;
