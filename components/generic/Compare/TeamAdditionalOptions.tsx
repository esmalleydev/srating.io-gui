'use client';

import { useState, useTransition } from 'react';

import { IconButton } from '@mui/material';
import TripleDotsIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import LuggageIcon from '@mui/icons-material/Luggage';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/compare-slice';
import { usePathname, useRouter } from 'next/navigation';
import Menu from '@/components/ux/menu/Menu';
import MenuList from '@/components/ux/menu/MenuList';
import MenuItem from '@/components/ux/menu/MenuItem';
import MenuListIcon from '@/components/ux/menu/MenuListIcon';
import MenuListText from '@/components/ux/menu/MenuListText';


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

  return (
    <div>
      <IconButton
          id="team-additional-options"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          <TripleDotsIcon />
        </IconButton>
        <Menu
          anchor={anchor}
          open={open}
          onClose={handleClose}
        >
          <MenuList>
            <MenuItem key='neutral-site-display' onClick={handleNeutral}>
            <MenuListIcon>
              {+neutral_site ? <CheckIcon fontSize='small' /> : <LuggageIcon fontSize='small' />}
            </MenuListIcon>
            <MenuListText primary='Neutral site game' />
          </MenuItem>
          </MenuList>
        </Menu>
    </div>
  );
};

export default TeamAdditionalOptions;
