'use client';

import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';
import TableColumns from '@/components/helpers/TableColumns';

const Legend = ({ open, onClose, columns, view, organization_id }) => {
  const headers = TableColumns.getColumns({ organization_id, view });
  const theme = useTheme();

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
      >
        <DialogTitle id="alert-dialog-title-legend">
          <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
            {'Column legend'}
            {<IconButton aria-label="close" onClick={onClose}><CloseIcon /></IconButton>}
          </div>
        </DialogTitle>
        <DialogContent>
          {
            columns.map((column: string) => {
              return (
                <div key = {column} style = {{ display: 'flex', margin: '5px 0px' }}>
                  <Typography type = 'subtitle2' style = {{ color: theme.info.main }}>{headers[column].label}:</Typography>
                  <Typography style = {{ marginLeft: 10 }} type = 'body2'>{headers[column].tooltip}</Typography>
                </div>
              );
            })
          }
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Legend;
