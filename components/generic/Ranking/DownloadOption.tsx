'use client';

import { useState, useTransition } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { useClientAPI } from '@/components/clientAPI';
import CSV from '@/components/utils/CSV';
import { setLoading } from '@/redux/features/loading-slice';
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import Tooltip from '@/components/ux/hover/Tooltip';
import Modal from '@/components/ux/container/Modal';
import Typography from '@/components/ux/text/Typography';
import Button from '@/components/ux/buttons/Button';
import { useTheme } from '@/components/hooks/useTheme';
import IconButton from '@/components/ux/buttons/IconButton';

const DownloadOption = ({ view, organization_id, division_id, season }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [openDialog, setOpenDialog] = useState(false);


  const handleSubscribe = () => {
    dispatch(setLoading(true));
    setOpenDialog(false);
    startTransition(() => {
      router.push('/pricing?view=api');
    });
  };


  const handleClose = () => {
    setOpenDialog(false);
  };


  const handleDownload = () => {
    dispatch(setLoading(true));
    useClientAPI({
      class: 'ranking',
      function: 'download',
      arguments: {
        view,
        organization_id,
        division_id,
        season,
      },
    }).then((data) => {
      dispatch(setLoading(false));
      if (!data || data === false || data.error) {
        setOpenDialog(true);
      } else {
        CSV.download(data);
      }
    }).catch((e) => {
      dispatch(setLoading(false));
    });
  };



  return (
    <div style = {{ lineHeight: 'initial' }}>
      <Tooltip text = {'Download CSV'}>
        <IconButton
          value="download-csv"
          onClick={handleDownload}
          icon = {<DownloadIcon />}
        />
      </Tooltip>
      <Modal
        open={openDialog}
        onClose={handleClose}
      >
        <Typography type = 'h6'>Subscription required</Typography>
          <Typography type = 'body1' style = {{ color: theme.text.secondary }}>
            Subscribe for $25 per month to get API and CSV download access
          </Typography>
        <div style = {{ textAlign: 'right' }}>
          <Button handleClick={handleClose} ink title='Maybe later' value = 'later' />
          <Button handleClick={handleSubscribe} autoFocus title = 'Subscribe' value = 'subscribe' />
        </div>
      </Modal>
    </div>
  );
};

export default DownloadOption;
