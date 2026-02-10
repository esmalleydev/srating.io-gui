
'use client';

import { useTheme } from '@/components/hooks/useTheme';
import React, { useState } from 'react';
import Typography from '../text/Typography';
import Objector from '@/components/utils/Objector';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';


export const getBaseLabelStyle = ({ theme }) => {
  return {
    color: theme.text.secondary,
    fontStyle: 'italic',
    lineHeight: 'initial',
    marginBottom: 2,
  };
};

/**
 * Slab component, just a label with some text
 */
const Slab = (
  {
    label,
    primary,
    info,
    style = {},
    labelStyle = {},
    primaryStyle = {},
  }:
  {
    label: string;
    primary: string | number;
    info?: string;
    style?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    primaryStyle?: React.CSSProperties;
  },
) => {
  const theme = useTheme();

  const [showInfo, setShowInfo] = useState(false);

  const baseLabelStyle = getBaseLabelStyle({ theme });

  const lStyle = Objector.extender(
    {},
    baseLabelStyle,
    labelStyle,
  );

  const pStyle = Objector.extender(
    { display: 'flex', alignItems: 'center' },
    primaryStyle,
  );

  let infoButton: React.JSX.Element | null = null;

  if (info) {
    infoButton = (
      <span style = {{ display: 'flex' }} onClick={() => setShowInfo(!showInfo)}>
        <HelpIcon style = {{ color: theme.info.main, cursor: 'pointer', marginLeft: 5, fontSize: 20 }} />
      </span>
    );
  }


  return (
    <div style = {style}>
      <Typography type = 'caption' style = {lStyle}>{label}</Typography>
      <Typography type = 'body2' style = {pStyle}>{primary}{infoButton}</Typography>
      {
        info && showInfo ?
          <Typography type = 'caption' style = {{ color: theme.text.secondary }}>{info}</Typography>
          : ''
      }
    </div>
  );
};

export default Slab;
