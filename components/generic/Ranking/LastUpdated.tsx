'use client';

import { Link, Typography } from '@mui/material';
import moment from 'moment';
import HelpIcon from '@mui/icons-material/Help';
import { getLastUpdated } from './DataHandler';


const LastUpdated = ({ view, handleLegend }) => {
  const lastUpdated = getLastUpdated({ view });
  const formatLastUpdated = (): string => {
    if (!lastUpdated) {
      return '';
    }

    if (view === 'transfer') {
      let date = moment();
      date = date.subtract(1, 'days');
      return date.format('MMMM Do YYYY');
    }

    return moment(lastUpdated.split('T')[0]).format('MMMM Do YYYY');
  };
  return (
    <>
      {
        lastUpdated ?
        <div style = {{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
          <Typography color="text.secondary" variant = 'body1' style = {{ fontStyle: 'italic' }}>{`Last updated: ${formatLastUpdated()}`}</Typography>
          <HelpIcon style = {{ margin: '0px 5px', cursor: 'pointer' }} onClick = {handleLegend} fontSize='small' color = 'info' />
          <Typography color="text.secondary" variant = 'body1' style = {{ fontStyle: 'italic' }}><Link style = {{ cursor: 'pointer' }} underline="hover" onClick = {handleLegend}>{'Legend'}</Link></Typography>
        </div> :
          ''
      }
    </>
  );
};

export default LastUpdated;
