'use client';

import { IconButton } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';
import TableColumns from '@/components/helpers/TableColumns';
import Modal from '@/components/ux/container/Modal';

const Legend = ({ open, onClose, columns, view, organization_id }) => {
  const headers = TableColumns.getColumns({ organization_id, view });
  const theme = useTheme();

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
      >
        <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography type = 'h6'>Column legend</Typography>
          <IconButton aria-label="close" onClick={onClose}><CloseIcon /></IconButton>
        </div>
        <div>
          {
            columns.map((column: string) => {
              if (!(column in headers)) {
                return null;
              }
              return (
                <div key = {column} style = {{ display: 'flex', margin: '5px 0px' }}>
                  <Typography type = 'subtitle2' style = {{ color: theme.info.main }}>{headers[column].label}:</Typography>
                  <Typography style = {{ marginLeft: 10 }} type = 'body2'>{headers[column].tooltip}</Typography>
                </div>
              );
            })
          }
        </div>
      </Modal>
    </>
  );
};

export default Legend;
