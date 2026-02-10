'use client';

import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CheckIcon from '@mui/icons-material/Check';
import Dates from '@/components/utils/Dates';
import { useTheme } from '@/components/hooks/useTheme';

const Title = () => {
  const theme = useTheme();
  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);

  const targetDateString = fantasy_group.draft_start_datetime;

  // 2. State to hold the formatted time string
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState<React.JSX.Element | null>(null);

  const getData = useCallback(() => {
    const data: {
      title: string;
      icon: React.JSX.Element | null;
    } = {
      title: 'TBD',
      icon: null,
    };

    if (!targetDateString) {
      return data;
    }

    if (fantasy_group.drafted) {
      data.title = 'Draft is over!';
      data.icon = <CheckIcon style = {{ color: theme.success.main }} />;
      return data;
    }

    const difference = Dates.parse(targetDateString, true).getTime() - new Date().getTime();

    if (difference <= 0) {
      data.title = 'Draft in-progress!';
      data.icon = <FiberManualRecordIcon style = {{ color: theme.error.main }} />;
      return data;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    data.title = `Draft begins: ${days}d ${hours}h ${minutes}m ${seconds}s`;

    return data;
  }, [targetDateString]);

  // 3. Effect to update the countdown every second
  useEffect(() => {
    let data = getData();

    // Initial call to prevent 1s delay on mount
    setTitle(data.title);
    setIcon(data.icon);

    const timer = setInterval(() => {
      data = getData();
      setTitle(data.title);
      setIcon(data.icon);
    }, 1000);

    return () => clearInterval(timer);
  }, [getData]);

  return (
    <div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {icon ? <span style = {{ display: 'flex', marginRight: 10 }}>{icon}</span> : ''}
      <Typography type='h5'>{title}</Typography>
    </div>
  );
};

export default Title;
