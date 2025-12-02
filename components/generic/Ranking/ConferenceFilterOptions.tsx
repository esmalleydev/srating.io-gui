'use client';

import CloseIcon from '@mui/icons-material/Close';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/loading-slice';
import { setDataKey } from '@/redux/features/ranking-slice';
import Modal from '@/components/ux/container/Modal';
import Typography from '@/components/ux/text/Typography';
import IconButton from '@/components/ux/buttons/IconButton';

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
      <Modal
        open={open}
        onClose={onClose}
      >
        <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography type = 'h6'>{'Conference filter options'}</Typography>
          <IconButton value = 'close' onClick={onClose} icon = {<CloseIcon />} />
        </div>
        <div>
          <FormGroup>
            <FormControlLabel control={<Switch checked = {filterOriginalConf} onChange={handleOrginalConfSwitch} />} label = 'Include Previous team' />
            <FormControlLabel control={<Switch checked = {filterCommittedConf} onChange={handleCommittedConfSwitch} />} label = 'Include New team' />
          </FormGroup>
        </div>
      </Modal>
    </>
  );
};

export default ConferenceFilterOptions;
