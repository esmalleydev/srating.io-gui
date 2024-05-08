import React, { useState, useTransition } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControlLabel, FormGroup, IconButton, Switch } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setFilterCommittedConf, setFilterOriginalConf } from '@/redux/features/ranking-slice';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import BackdropLoader from '@/components/generic/BackdropLoader';

const ConferenceFilterOptions = ({ open, onClose }) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [spin, setSpin] = useState(false);

  const dispatch = useAppDispatch();
  const filterCommittedConf = useAppSelector(state => state.rankingReducer.filterCommittedConf);
  const filterOriginalConf = useAppSelector(state => state.rankingReducer.filterOriginalConf);

  const handleOrginalConfSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: boolean = event.target.checked;
    setSpin(true);
    startTransition(() => {
      if (newValue !== filterOriginalConf) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('filterOriginalConf', (+newValue).toString());
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.replace(`${pathName}${query}`);
        dispatch(setFilterOriginalConf(newValue));
      }
      setSpin(false);
    });
  };

  const handleCommittedConfSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: boolean = event.target.checked;
    setSpin(true);
    startTransition(() => {
      if (newValue !== filterCommittedConf) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('filterCommittedConf', (+newValue).toString());
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.replace(`${pathName}${query}`);
        dispatch(setFilterCommittedConf(newValue));
      }
      setSpin(false);
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
      >
        <BackdropLoader open = {spin} />
        <DialogTitle id="alert-dialog-title">
          {'Conference filter options'}
          {<IconButton aria-label="close" onClick={onClose}><CloseIcon /></IconButton>}
        </DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControlLabel control={<Switch checked = {filterOriginalConf} onChange={handleOrginalConfSwitch} />} label = 'Include Previous team' />
            <FormControlLabel control={<Switch checked = {filterCommittedConf} onChange={handleCommittedConfSwitch} />} label = 'Include New team' />
          </FormGroup>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ConferenceFilterOptions;