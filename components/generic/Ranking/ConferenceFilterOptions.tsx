'use client';

import CloseIcon from '@esmalley/react-material-icons/Close';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoading } from '@/redux/features/loading-slice';
import { setDataKey } from '@/redux/features/ranking-slice';
import Modal from '@/components/ux/modal/Modal';
import Typography from '@/components/ux/text/Typography';
import IconButton from '@/components/ux/buttons/IconButton';
import Switch from '@/components/ux/input/Switch';

const ConferenceFilterOptions = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const filterCommittedConf = useAppSelector((state) => state.rankingReducer.filterCommittedConf);
  const filterOriginalConf = useAppSelector((state) => state.rankingReducer.filterOriginalConf);

  const handleOrginalConfSwitch = (value: boolean) => {
    if (value !== filterOriginalConf) {
      dispatch(setLoading(true));
      dispatch(setDataKey({ key: 'filterOriginalConf', value }));
    }
  };

  const handleCommittedConfSwitch = (value: boolean) => {
    if (value !== filterCommittedConf) {
      dispatch(setDataKey({ key: 'filterCommittedConf', value }));
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
          <IconButton value = 'close' onClick={onClose} icon = {<CloseIcon style = {{ fontSize: 24 }} />} />
        </div>
        <div>
          <Switch label = 'Include Previous team' labelPlacement='end' value = {filterOriginalConf} onChange={handleOrginalConfSwitch} />
          <Switch label = 'Include New team' labelPlacement='end' value = {filterCommittedConf} onChange={handleCommittedConfSwitch} />
        </div>
      </Modal>
    </>
  );
};

export default ConferenceFilterOptions;
