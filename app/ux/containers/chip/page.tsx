'use client';

import Chip from '@/components/ux/container/Chip';
import Typography from '@/components/ux/text/Typography';
import { useState } from 'react';



export default function Page() {
  const [clickableFilled, setClickableFilled] = useState(false);
  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Chip</Typography>
      <Typography type='h6' style={{ marginBottom: 10 }}>Standard</Typography>
      <Chip title='Standard chip' value = {1} />
      <Typography type='h6' style={{ marginBottom: 10 }}>Filled</Typography>
      <Chip title='Filled chip' value = {1} filled />
      <Typography type='h6' style={{ marginBottom: 10 }}>Clickable</Typography>
      <Chip title='Clickable' value = {1} filled = {clickableFilled} onClick={() => setClickableFilled(!clickableFilled)} />
    </div>
  );
}
