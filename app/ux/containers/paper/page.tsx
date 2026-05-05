'use client';

import Paper from '@/components/ux/container/Paper';
import Typography from '@/components/ux/text/Typography';
import CodeBlock from '@/components/ux/text/CodeBlock';
import AddIcon from '@esmalley/react-material-icons/Add';
import IconButton from '@/components/ux/buttons/IconButton';
import Divider from '@/components/ux/display/Divider';

export default function Page() {
  const buttons = [
    <IconButton icon = {<AddIcon style = {{ fontSize: 20 }} />} type = 'circle' value={1} onClick={() => alert('you clicked a button')} />,
  ];

  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Paper</Typography>
      <Typography type='body1' style={{ marginBottom: 10 }}>
        The Paper component is used to create surfaces with elevation and shadows.
        It can also handle hover effects, transparency, and even host buttons.
      </Typography>

       <Typography type='h6' style={{ marginBottom: 10 }}>Standard</Typography>
       <Paper style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Paper</Paper>
       <CodeBlock code={`
          import Paper from '@/components/ux/container/Paper';

          <Paper style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Paper
          </Paper>
        `} />
       <Divider />

       <Typography type='h6' style={{ marginBottom: 10 }}>Different elevation</Typography>
       <Paper elevation={10} style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>10</Paper>
       <CodeBlock code={`
          import Paper from '@/components/ux/container/Paper';

          <Paper
            elevation={10}
            style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            10
          </Paper>
        `} />
       <Divider />

       <Typography type='h6' style={{ marginBottom: 10 }}>Hover</Typography>
       <Paper hover style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Hover</Paper>
       <CodeBlock code={`
          import Paper from '@/components/ux/container/Paper';

          <Paper
            hover
            style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            Hover
          </Paper>
        `} />
       <Divider />

       <Typography type='h6' style={{ marginBottom: 10 }}>Transparency</Typography>
       <Paper tranparency={0.5} style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>50% Transparency</Paper>
       <CodeBlock code={`
          import Paper from '@/components/ux/container/Paper';

          <Paper
            tranparency={0.5}
            style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            50% Transparency
          </Paper>
        `} />
       <Divider />

       <Typography type='h6' style={{ marginBottom: 10 }}>With Buttons</Typography>
       <Paper style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }} buttons={buttons}>Included button</Paper>
       <CodeBlock code={`
          import Paper from '@/components/ux/container/Paper';
          import IconButton from '@/components/ux/buttons/IconButton';
          import AddIcon from '@esmalley/react-material-icons/Add';

          const buttons = [
            <IconButton icon={<AddIcon />} type='circle' value={1} onClick={() => alert('Clicked')} />
          ];

          <Paper
            style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            buttons={buttons}
          >
            Included button
          </Paper>
        `} />
    </div>
  );
}

