'use client';
import React, { useState, useTransition } from 'react';

import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import TripleDotsIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import LuggageIcon from '@mui/icons-material/Luggage';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setNeutralSite } from '@/redux/features/compare-slice';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import BackdropLoader from '@/components/generic/BackdropLoader';


const TeamAdditionalOptions = ({ neutral_site }: { neutral_site: boolean}) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [spin, setSpin] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const dispatch = useAppDispatch();
  // const neutral_site = useAppSelector(state => state.compareReducer.neutral_site);


  const handleNeutral = () => {
    const newValue: boolean = !neutral_site;
    setSpin(true);
    startTransition(() => {
      if (newValue !== neutral_site) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('neutral', (+newValue).toString());
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.replace(`${pathName}${query}`);
        dispatch(setNeutralSite(newValue));
      }
      handleClose();
      setSpin(false);
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
      <BackdropLoader open = {spin} />
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
          id="long-menu"
          anchorEl={anchor}
          open={open}
          onClose={handleClose}
        >
          <MenuItem key='neutral-site-display' onClick={handleNeutral}>
            <ListItemIcon>
              {+neutral_site ? <CheckIcon fontSize='small' /> : <LuggageIcon fontSize='small' />}
            </ListItemIcon>
            <ListItemText>Neutral site game</ListItemText>
          </MenuItem>
        </Menu>
    </div>
  );
}

export default TeamAdditionalOptions;