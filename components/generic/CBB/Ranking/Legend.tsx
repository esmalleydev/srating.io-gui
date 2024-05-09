import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { getHeaderColumns } from '@/app/cbb/ranking/columns';

const Legend = ({ open, onClose, columns, rankView }) => {

  const headers = getHeaderColumns({rankView})

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
      >
        <DialogTitle id="alert-dialog-title-legend">
          <div style = {{'display': 'flex', 'justifyContent': 'space-between'}}>
            {'Column legend'}
            {<IconButton aria-label="close" onClick={onClose}><CloseIcon /></IconButton>}
          </div>
        </DialogTitle>
        <DialogContent>
          {
            columns.map((column) => {
              return (
                <div style = {{'display': 'flex', 'margin': '5px 0px'}}>
                  <Typography color = 'text.secondary' variant = 'subtitle2'>{headers[column].label}:</Typography>
                  <Typography style = {{'marginLeft': 10}} variant = 'body2'>{headers[column].tooltip}</Typography>
                </div>
              );
            })
          }
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Legend;