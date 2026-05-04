'use client';

import Tab from '@/components/ux/buttons/Tab';
import Typography from '@/components/ux/text/Typography';
import { useState } from 'react';


export default function Page() {
  const [selected, setSelected] = useState(1);

  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Tab</Typography>
      <Typography type='body1' style={{ marginBottom: 10 }}>This are mainly used for navigation.</Typography>

      <div style = {{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Tab title = 'Tab 1' value={1} selected={selected === 1} handleClick={(e, value) => setSelected(value as number)} />
        <Tab title = 'Tab 2' value={2} selected={selected === 2} handleClick={(e, value) => setSelected(value as number)} />
        <Tab title = 'Tab 3' value={3} selected={selected === 3} handleClick={(e, value) => setSelected(value as number)} />
      </div>
    </div>
  );
}
