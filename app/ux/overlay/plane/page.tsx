'use client';

import { useState } from 'react';
import Plane from '@/components/ux/overlay/Plane';
import Button from '@/components/ux/buttons/Button';
import Typography from '@/components/ux/text/Typography';
import Paper from '@/components/ux/container/Paper';
import CodeBlock from '@/components/ux/text/CodeBlock';

export default function Page() {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const handleToggle = (e) => {
    setAnchor(e.currentTarget);
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const handleClose = (e: MouseEvent) => {
    setOpen(false);
  };

  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Plane</Typography>

      <Typography type='body1'>The plane component is a popover which can contain any contents.</Typography>
      <Typography type='body1' style={{ marginBottom: 10 }}>It can be anchored to display near an element (like a button which triggers it).</Typography>
      <Button
        title='Toggle Plane'
        value={1}
        handleClick={handleToggle}
      />

      <Plane
        open={open}
        anchor={anchor}
        onClose={handleClose}
      >
        <Paper style={{ padding: 15 }}>
          <Typography type='h6'>Plane Content</Typography>
          <Typography type='body2'>This popover is anchored to the button above.</Typography>
        </Paper>
      </Plane>

      <CodeBlock code = {`
        import Plane from '@/components/ux/overlay/Plane';
        import Button from '@/components/ux/buttons/Button';

        const [open, setOpen] = useState(false);
        const [anchor, setAnchor] = useState<HTMLElement | null>(null);

        const handleToggle = (e) => {
          setAnchor(e.currentTarget);
          if (open) {
            setOpen(false);
          } else {
            setOpen(true);
          }
        };

        const handleClose = (e: MouseEvent) => {
          setOpen(false);
        };

        <Button
          title='Toggle Plane'
          value={1}
          handleClick={handleToggle}
        />

        <Plane
          open={open}
          anchor={anchor}
          onClose={handleClose}
        >
          <Paper style={{ padding: 15 }}>
            <Typography type='h6'>Plane Content</Typography>
            <Typography type='body2'>This popover is anchored to the button above.</Typography>
          </Paper>
        </Plane>
      `} />
    </div>
  );
}
