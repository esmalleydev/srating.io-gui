'use client';

import Slab from '@/components/ux/container/Slab';
import Divider from '@/components/ux/display/Divider';
import Typography from '@/components/ux/text/Typography';


export default function Page() {
  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Slab</Typography>
      <Typography type='h6' style={{ marginBottom: 10 }}>Standard</Typography>
      <Slab label = 'Slab label' primary = 'Slab primary text' />
      <Divider />
      <Typography type='h6' style={{ marginBottom: 10 }}>Slab with info</Typography>
      <Slab label = 'Label infomation' primary = 'Slab primary information' info='Slab extra information' />
      <Divider />
    </div>
  );
}
