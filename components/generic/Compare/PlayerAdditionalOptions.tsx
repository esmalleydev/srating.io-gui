'use client';

import { useState } from 'react';

import TripleDotsIcon from '@esmalley/react-material-icons/MoreVert';
import CheckIcon from '@esmalley/react-material-icons/Check';
import VisibilityIcon from '@esmalley/react-material-icons/Visibility';
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
      icon: hideLowerBench ? <CheckIcon style = {{ fontSize: 20 }} /> : <VisibilityIcon style = {{ fontSize: 20 }} />,
    },
  ];

  return (
    <div>
      <IconButton
        value="player-additional-options"
        onClick={handleOpen}
        icon = {<TripleDotsIcon style = {{ fontSize: 24 }} />}
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
