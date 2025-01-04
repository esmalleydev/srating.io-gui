'use client';

import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { getHeaderColumns } from './columns';

const Legend = ({ open, onClose, columns, view, organization_id }) => {
  const headers = getHeaderColumns({ organization_id, view });

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
                  <Typography color = 'info.main' variant = 'subtitle2'>{headers[column].label}:</Typography>
                  <Typography style = {{ marginLeft: 10 }} variant = 'body2'>{headers[column].tooltip}</Typography>
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
