'use client';


import HelpIcon from '@mui/icons-material/Help';
import { getLastUpdated } from './DataHandler';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';
import Style from '@/components/utils/Style';
import Dates from '@/components/utils/Dates';


const LastUpdated = ({ view, handleLegend }) => {
  const theme = useTheme();
  const lastUpdated = getLastUpdated({ view });
  const formatLastUpdated = (): string => {
    if (!lastUpdated) {
      return '';
    }

    return Dates.format(Dates.parse(lastUpdated, true), 'F jS Y g:i a');
  };

  const spanStyle = {
    '&:hover': {
      'text-decoration': 'underline',
    },
    cursor: 'pointer',
  };


  return (
    <>
      {
        lastUpdated ?
        <div style = {{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
          <Typography type = 'body1' style = {{ fontStyle: 'italic', color: theme.text.secondary }}>{`Last updated: ${formatLastUpdated()}`}</Typography>
          <HelpIcon style = {{ margin: '0px 5px', cursor: 'pointer' }} onClick = {handleLegend} fontSize='small' color = 'info' />
          <Typography type = 'body1' style = {{ fontStyle: 'italic', color: theme.link.primary }}><span className={Style.getStyleClassName(spanStyle)} onClick = {handleLegend}>{'Legend'}</span></Typography>
        </div> :
          ''
      }
    </>
  );
};

export default LastUpdated;
