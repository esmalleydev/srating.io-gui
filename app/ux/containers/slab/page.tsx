'use client';

import Slab from '@/components/ux/container/Slab';
import Divider from '@/components/ux/display/Divider';
import CodeBlock from '@/components/ux/text/CodeBlock';
import Typography from '@/components/ux/text/Typography';


export default function Page() {
  return (
    <div style={{ padding: 20 }}>
      <Typography type='h5' style={{ marginBottom: 20 }}>Slab</Typography>
      <Typography type='body1' style={{ marginBottom: 10 }}>
        A Slab is a specialized container for displaying information with a label and primary/secondary text.
      </Typography>

      <Typography type='h6' style={{ marginBottom: 10 }}>Standard</Typography>
      <Slab label='Slab label' primary='Slab primary text' />
      <CodeBlock code={`
        import Slab from '@/components/ux/container/Slab';

        <Slab label='Slab label' primary='Slab primary text' />
      `} />
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Slab with info</Typography>
      <Slab label='Label information' primary='Slab primary information' info='Slab extra information' />
      <CodeBlock code={`
        import Slab from '@/components/ux/container/Slab';

        <Slab
          label='Label information'
          primary='Slab primary information'
          info='Slab extra information'
        />
      `} />
      <Divider />
    </div>
  );
}
