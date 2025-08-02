'use client';

import { useState, useTransition } from 'react';

import { IconButton } from '@mui/material';
import TripleDotsIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import LuggageIcon from '@mui/icons-material/Luggage';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setNeutralSite } from '@/redux/features/compare-slice';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { setLoading } from '@/redux/features/display-slice';
import Menu from '@/components/ux/menu/Menu';
import MenuList from '@/components/ux/menu/MenuList';
import MenuItem from '@/components/ux/menu/MenuItem';
import MenuListIcon from '@/components/ux/menu/MenuListIcon';
import MenuListText from '@/components/ux/menu/MenuListText';


const TeamAdditionalOptions = ({ neutral_site }: { neutral_site: boolean}) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const dispatch = useAppDispatch();
  // const neutral_site = useAppSelector(state => state.compareReducer.neutral_site);


  const handleNeutral = () => {
    const newValue: boolean = !neutral_site;
    dispatch(setLoading(true));
    startTransition(() => {
      if (newValue !== neutral_site) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('neutral', (+newValue).toString());
        const search = current.toString();
        const query = search ? `?${search}` : '';
        router.replace(`${pathName}${query}`);
        dispatch(setNeutralSite(newValue));
      }
      handleClose();
    });
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
