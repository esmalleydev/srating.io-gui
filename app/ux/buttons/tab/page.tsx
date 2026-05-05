'use client';

import Tab from '@/components/ux/buttons/Tab';
import Typography from '@/components/ux/text/Typography';
import CodeBlock from '@/components/ux/text/CodeBlock';
import Divider from '@/components/ux/display/Divider';
import { useState } from 'react';

export default function Page() {
  const [selected, setSelected] = useState(1);

  return (
    <div style={{ padding: 20 }}>
      <Typography type='h5' style={{ marginBottom: 20 }}>Tab</Typography>
      <Typography type='body1' style={{ marginBottom: 10 }}>
        Tabs are primarily used for navigation between different views within the same context.
      </Typography>

      <Typography type='h6' style={{ marginBottom: 10 }}>Navigation</Typography>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Tab title='Tab 1' value={1} selected={selected === 1} handleClick={(e, value) => setSelected(value as number)} />
        <Tab title='Tab 2' value={2} selected={selected === 2} handleClick={(e, value) => setSelected(value as number)} />
        <Tab title='Tab 3' value={3} selected={selected === 3} handleClick={(e, value) => setSelected(value as number)} />
      </div>
      <CodeBlock code={`
        import { useState } from 'react';
        import Tab from '@/components/ux/buttons/Tab';

        const [selected, setSelected] = useState(1);

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Tab title='Tab 1' value={1} selected={selected === 1} handleClick={(e, value) => setSelected(value as number)} />
          <Tab title='Tab 2' value={2} selected={selected === 2} handleClick={(e, value) => setSelected(value as number)} />
          <Tab title='Tab 3' value={3} selected={selected === 3} handleClick={(e, value) => setSelected(value as number)} />
        </div>
      `} />
      <Divider />
    </div>
  );
}
