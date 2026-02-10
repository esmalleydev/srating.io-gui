'use client';

import { useState, useTransition } from 'react';

import TripleDotsIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import LuggageIcon from '@mui/icons-material/Luggage';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/compare-slice';
import { usePathname, useRouter } from 'next/navigation';
import Menu, { MenuOption } from '@/components/ux/menu/Menu';
import IconButton from '@/components/ux/buttons/IconButton';


const TeamAdditionalOptions = () => {
  const router = useRouter();
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const dispatch = useAppDispatch();
  const neutral_site = useAppSelector((state) => state.compareReducer.neutral_site);


  const handleNeutral = () => {
    const newValue: boolean = !neutral_site;
    if (newValue !== neutral_site) {
      const current = new URLSearchParams(window.location.search);
      current.set('neutral_site', (+newValue).toString());
      window.history.replaceState(null, '', `?${current.toString()}`);

      // use pushState if we want to add to back button history
      // window.history.pushState(null, '', `?${current.toString()}`);
      const search = current.toString();
      const query = search ? `?${search}` : '';
      startTransition(() => {
        router.replace(`${pathName}${query}`);
      });
      dispatch(setDataKey({ key: 'neutral_site', value: newValue }));
    }
    handleClose();
  };


  const handleOpen = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const options: MenuOption[] = [
    {
      value: 'neutral_site',
      label: 'Neutral site game',
      selectable: true,
      onSelect: handleNeutral,
      icon: +neutral_site ? <CheckIcon fontSize='small' /> : <LuggageIcon fontSize='small' />
    }
  ];

  return (
    <div>
      <IconButton
        value="team-additional-options"
        onClick={handleOpen}
        icon = {<TripleDotsIcon />}
      />
      <Menu
        anchor={anchor}
        open={open}
        onClose={handleClose}
        options={options}
      />
    </div>
  );
};

export default TeamAdditionalOptions;
