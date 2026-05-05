'use client';

import Chip from '@/components/ux/container/Chip';
import Divider from '@/components/ux/display/Divider';
import CodeBlock from '@/components/ux/text/CodeBlock';
import Typography from '@/components/ux/text/Typography';
import { useState } from 'react';



export default function Page() {
  const [clickableFilled, setClickableFilled] = useState(false);
  return (
    <div style={{ padding: 20 }}>
      <Typography type='h5' style={{ marginBottom: 20 }}>Chip</Typography>
      <Typography type='body1' style={{ marginBottom: 10 }}>
        Chips are compact elements that represent an attribute, entity, or action.
      </Typography>

      <Typography type='h6' style={{ marginBottom: 10 }}>Standard</Typography>
      <Chip title='Standard chip' value={1} />
      <CodeBlock code={`
        import Chip from '@/components/ux/container/Chip';

        <Chip title='Standard chip' value={1} />
      `} />
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Filled</Typography>
      <Chip title='Filled chip' value={1} filled />
      <CodeBlock code={`
        import Chip from '@/components/ux/container/Chip';

        <Chip title='Filled chip' value={1} filled />
      `} />
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Clickable</Typography>
      <Chip
        title='Clickable'
        value={1}
        filled={clickableFilled}
        onClick={() => setClickableFilled(!clickableFilled)}
      />
      <CodeBlock code={`
        import { useState } from 'react';
        import Chip from '@/components/ux/container/Chip';

        const [isActive, setIsActive] = useState(false);

        <Chip
          title='Clickable'
          value={1}
          filled={isActive}
          onClick={() => setIsActive(!isActive)}
        />
      `} />
      <Divider />
    </div>
  );
}
