'use client';

import { useState } from 'react';

import TripleDotsIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/compare-slice';
import Menu, { MenuOption } from '@/components/ux/menu/Menu';
import IconButton from '@/components/ux/buttons/IconButton';

const PlayerAdditionalOptions = () => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const dispatch = useAppDispatch();
  const hideLowerBench = useAppSelector((state) => state.compareReducer.hideLowerBench);


  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const options: MenuOption[] = [
    {
      value: 'hideLowerBench',
      label: 'Hide under 3 MPG',
      selectable: true,
      onSelect: () => {
        dispatch(setDataKey({ key: 'hideLowerBench', value: !hideLowerBench }));
        handleClose();
      },
      icon: hideLowerBench ? <CheckIcon fontSize='small' /> : <VisibilityIcon fontSize='small' />,
    },
  ];

  return (
    <div>
      <IconButton
        value="player-additional-options"
        onClick={handleOpen}
        icon = {<TripleDotsIcon />}
      />
      <Menu
        anchor={anchor}
        open={open}
        onClose={handleClose}
        options = {options}
      />
    </div>
  );
};

export default PlayerAdditionalOptions;
