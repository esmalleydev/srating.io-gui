'use client';

import Paper from '@/components/ux/container/Paper';
import Divider from '@/components/ux/display/Divider';
import Columns from '@/components/ux/layout/Columns';
import Typography from '@/components/ux/text/Typography';


export default function Page() {
  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Columns</Typography>
      <Typography type = 'body1'>Columns default at 2 with a breakpoint of 475.</Typography>
      <Typography type='h6' style={{ marginBottom: 10 }}>2 columns</Typography>
      <Columns>
        <Paper style = {{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>1</Paper>
        <Paper style = {{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>2</Paper>
      </Columns>
      <Divider style = {{ margin: '5px 0px' }} />

      <Typography type='h6' style={{ marginBottom: 10 }}>5 columns</Typography>
      <Columns numberOfColumns={5}>
        <Paper style = {{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>1</Paper>
        <Paper style = {{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>2</Paper>
        <Paper style = {{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>3</Paper>
        <Paper style = {{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>4</Paper>
        <Paper style = {{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>5</Paper>
      </Columns>
      <Divider style = {{ margin: '5px 0px' }} />


      <Typography type='h6' style={{ marginBottom: 10 }}>3 columns, 600px breakpoint</Typography>
      <Columns numberOfColumns={3}>
        <Paper style = {{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>1</Paper>
        <Paper style = {{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>2</Paper>
        <Paper style = {{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>3</Paper>
      </Columns>
      <Divider style = {{ margin: '5px 0px' }} />
    </div>
  );
}
