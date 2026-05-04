'use client';

import Button from '@/components/ux/buttons/Button';
import Tile from '@/components/ux/container/Tile';
import Divider from '@/components/ux/display/Divider';
import Typography from '@/components/ux/text/Typography';
import InfoIcon from '@esmalley/react-material-icons/Info';
import MouseIcon from '@esmalley/react-material-icons/Mouse';


export default function Page() {
  const buttons = [
    <Button title = 'A button' value = {1} ink handleClick={() => alert('you clicked a button')} />,
  ];

  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Tile</Typography>
      <Typography type='h6' style={{ marginBottom: 10 }}>Standard</Typography>
      <Tile primary = 'Standard tile' />
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Secondary</Typography>
      <Tile primary = 'Primary line' secondary='Secondary line' />
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Icon</Typography>
      <Tile primary = 'Primary line' secondary='Secondary line' icon = {<InfoIcon style = {{ fontSize: 20 }} />} />
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Buttons</Typography>
      <Tile primary = 'Primary line' secondary='Secondary line' icon = {<InfoIcon style = {{ fontSize: 20 }} />} buttons = {buttons} />
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Clickable</Typography>
      <Tile primary = 'Click me' secondary='Secondary line' icon = {<MouseIcon style = {{ fontSize: 20 }} />} onClick={() => alert('Tile was clicked')} />
      <Divider />
    </div>
  );
}
