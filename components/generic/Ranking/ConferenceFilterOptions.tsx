'use client';

import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControlLabel, FormGroup, IconButton, Switch } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/display-slice';
import { setDataKey } from '@/redux/features/ranking-slice';

const ConferenceFilterOptions = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const filterCommittedConf = useAppSelector((state) => state.rankingReducer.filterCommittedConf);
  const filterOriginalConf = useAppSelector((state) => state.rankingReducer.filterOriginalConf);

  const handleOrginalConfSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: boolean = event.target.checked;
    dispatch(setLoading(true));
    if (newValue !== filterOriginalConf) {
      dispatch(setDataKey({ key: 'filterOriginalConf', value: newValue }));
    }
  };

  const handleCommittedConfSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: boolean = event.target.checked;
    if (newValue !== filterCommittedConf) {
      dispatch(setDataKey({ key: 'filterCommittedConf', value: newValue }));
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
      >
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
};

export default ConferenceFilterOptions;
