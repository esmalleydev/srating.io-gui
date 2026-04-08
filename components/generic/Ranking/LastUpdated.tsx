'use client';


import HelpIcon from '@esmalley/react-material-icons/Help';
import { getLastUpdated } from './DataHandler';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/ux/contexts/themeContext';
import { Dates, Style } from '@esmalley/ts-utils';


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
          <HelpIcon style = {{ margin: '0px 5px', cursor: 'pointer', fontSize: 20, color: theme.info.main }} onClick = {handleLegend} />
          <Typography type = 'body1' style = {{ fontStyle: 'italic', color: theme.link.primary }}><span className={Style.getStyleClassName(spanStyle)} onClick = {handleLegend}>{'Legend'}</span></Typography>
        </div> :
          ''
      }
    </>
  );
};

export default LastUpdated;
