'use client';

import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';



export default function Page() {
  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Paper</Typography>
      <Typography type='h6' style={{ marginBottom: 10 }}>Standard</Typography>
      <Paper style = {{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Paper</Paper>
      <Typography type='h6' style={{ marginBottom: 10 }}>Different elevation</Typography>
      <Paper elevation={10} style = {{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>10</Paper>
      <Typography type='h6' style={{ marginBottom: 10 }}>Hover</Typography>
      <Paper hover style = {{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Hover</Paper>
    </div>
  );
}
