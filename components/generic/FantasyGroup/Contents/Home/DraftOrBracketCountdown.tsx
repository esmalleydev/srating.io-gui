'use client';

import FantasyGroup from '@/components/helpers/FantasyGroup';
import Navigation from '@/components/helpers/Navigation';
import { useTheme } from '@/components/hooks/useTheme';
import Button from '@/components/ux/buttons/Button';
import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';
import { useCallback, useEffect, useState } from 'react';

const DraftOrBracketCountdown = () => {
  const theme = useTheme();
  const navigation = new Navigation();
  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);

  const fantasyHelper = new FantasyGroup({ fantasy_group });

  // 1. Determine the target date based on whether it is a draft or bracket
  const targetDateString = fantasyHelper.isDraft()
    ? fantasy_group?.draft_start_datetime
    : fantasy_group?.start_date;

  // 2. State to hold the formatted time string
  const [timeLeft, setTimeLeft] = useState('');

  const calculateTimeLeft = useCallback(() => {
    if (!targetDateString) return 'TBD';

    const difference = +new Date(targetDateString) - +new Date();

    if (difference <= 0) {
      return 'Started';
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, [targetDateString]);

  // 3. Effect to update the countdown every second
  useEffect(() => {
    // Initial call to prevent 1s delay on mount
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);


  const handleView = (view: string) => {
    navigation.fantasyGroupView({ view });
  };




  return (
    <div>
      <Typography type='h6'>
        {fantasyHelper.isDraft() ? 'Draft Countdown' : 'Bracket Countdown'}
      </Typography>
      <Paper style={{ padding: 16, textAlign: 'center' }}>
        <Typography type='h4' style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
          {timeLeft}
        </Typography>
        {
          fantasyHelper.isDraft() ?
          <Button value = 'view-draft' title = 'View draft' handleClick={() => handleView('draft')} />
            : ''
        }
      </Paper>
    </div>
  );
};

export default DraftOrBracketCountdown;
