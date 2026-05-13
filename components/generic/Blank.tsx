'use client';

import { Typography, useTheme } from '@esmalley/react-material-ui';
import React from 'react';


const Blank = (
  {
    text,
    icon,
  }:
  {
    text: string;
    icon?: React.JSX.Element;
  },
) => {
  const theme = useTheme();

  return (
    <div style = {{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
      {icon ? <span style = {{ display: 'flex', marginRight: 10 }}>{icon}</span> : ''}
      <Typography type = 'body1' style = {{ color: theme.text.secondary }}>{text}</Typography>
    </div>
  );
};

export default Blank;



