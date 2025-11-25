'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { setLoading } from '@/redux/features/loading-slice';
import Typography from '@/components/ux/text/Typography';
import Button from '@/components/ux/buttons/Button';
import { useTheme } from '@/components/hooks/useTheme';

const ClientWrapper = ({ children }) => {
  const theme = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();

  const handleSubscribe = () => {
    dispatch(setLoading(true));
    startTransition(() => {
      router.push('/pricing');
    });
  };

  return (
    <>
      <div style = {{ textAlign: 'center', maxWidth: 700, margin: 'auto' }}>
        <Typography style = {{ padding: '0px 5px', textAlign: 'center', color: theme.text.secondary }} type='body1'>Below is a break down of my win prediction percentage, and the actual percentage that were correct. You can view the data by date range, the whole season, by day, week or month.</Typography>
        <div style = {{ textAlign: 'center' }}><Button buttonStyle = {{ backgroundColor: theme.amber[700] }} handleClick={handleSubscribe} title = {'Subscribe'} value = 'subscribe' /></div>
      </div>
      {children}
    </>
  );
};

export default ClientWrapper;
