import { useState } from 'react';

import TripleDotsIcon from '@mui/icons-material/MoreVert';

import RankPicker from '@/components/generic/RankPicker';
import Menu, { MenuOption } from '@/components/ux/menu/Menu';
import IconButton from '@/components/ux/buttons/IconButton';

const AdditionalOptions = () => {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const [rankPickerOpen, setRankPickerOpen] = useState(false);


  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const menuOptions: MenuOption[] = [
    {
      value: 'rank-display',
      label: 'Rank display',
      selectable: true,
      onSelect: () => {
        setRankPickerOpen(true);
        handleClose();
      },
    },
  ];

  return (
    <div>
      <IconButton
        value="additional-options"
        onClick={handleOpen}
        icon = {<TripleDotsIcon />}
      />
      <Menu
        anchor={anchor}
        open={open}
        onClose={handleClose}
        options = {menuOptions}
      />
      <RankPicker open = {rankPickerOpen} openHandler = {() => { setRankPickerOpen(true); }} closeHandler = {() => { setRankPickerOpen(false); }} />
    </div>
  );
};

export default AdditionalOptions;
