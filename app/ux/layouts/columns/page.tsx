'use client';

import Paper from '@/components/ux/container/Paper';
import Divider from '@/components/ux/display/Divider';
import Columns from '@/components/ux/layout/Columns';
import Typography from '@/components/ux/text/Typography';
import CodeBlock from '@/components/ux/text/CodeBlock';

export default function Page() {
  return (
    <div style={{ padding: 20 }}>
      <Typography type='h5' style={{ marginBottom: 20 }}>Columns</Typography>
      <Typography type='body1' style={{ marginBottom: 20 }}>
        The Columns component provides a responsive grid system. You can specify the number of columns on different screen sizes using a breakpoint.
      </Typography>

      <Typography type='h6' style={{ marginBottom: 10 }}>2 columns (default)</Typography>
      <Columns>
        <Paper style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>1</Paper>
        <Paper style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>2</Paper>
      </Columns>
      <CodeBlock code={`
        import Columns from '@/components/ux/layout/Columns';
        import Paper from '@/components/ux/container/Paper';

        <Columns>
          <Paper>1</Paper>
          <Paper>2</Paper>
        </Columns>
      `} />
      <Divider style={{ margin: '20px 0' }} />

      <Typography type='h6' style={{ marginBottom: 10 }}>5 columns</Typography>
      <Columns numberOfColumns={5}>
        <Paper style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>1</Paper>
        <Paper style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>2</Paper>
        <Paper style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>3</Paper>
        <Paper style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>4</Paper>
        <Paper style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>5</Paper>
      </Columns>
      <CodeBlock code={`
        import Columns from '@/components/ux/layout/Columns';
        import Paper from '@/components/ux/container/Paper';

        <Columns numberOfColumns={5}>
          <Paper>1</Paper>
          <Paper>2</Paper>
          <Paper>3</Paper>
          <Paper>4</Paper>
          <Paper>5</Paper>
        </Columns>
      `} />
      <Divider style={{ margin: '20px 0' }} />

      <Typography type='h6' style={{ marginBottom: 10 }}>3 columns, 600px breakpoint</Typography>
      <Columns numberOfColumns={3}>
        <Paper style={{ width: '10CC', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>1</Paper>
        <Paper style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>2</Paper>
        <Paper style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>3</Paper>
      </Columns>
      <CodeBlock code={`
        import Columns from '@/components/ux/layout/Columns';
        import Paper from '@/components/ux/container/Paper';

        <Columns numberOfColumns={3}>
          <Paper>1</Paper>
          <Paper>2</Paper>
          <Paper>3</Paper>
        </Columns>
      `} />
    </div>
  );
}
