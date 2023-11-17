import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Tooltip } from '@mui/material';


const Indicator = (props) => {
  const theme = useTheme();

  const title = props.title;
  const code = props.code;
  const backgroundColor = props.color || '#0288d1';

  const spanStyle = {
    'fontSize': '10px',
    'padding': '3px',
    'minWidth': '18px',
    'textAlign': 'center',
    'borderBottomLeftRadius': '5px',
    'borderBottomRightRadius': '5px',
    'backgroundColor': backgroundColor,
    'color': theme.palette.getContrastText(backgroundColor),
  };

  return (
    <Tooltip enterTouchDelay={0} disableFocusListener placement = 'top' title={title}>
      <span style = {spanStyle}>{code}</span>
    </Tooltip>
  );
}

export default Indicator;
