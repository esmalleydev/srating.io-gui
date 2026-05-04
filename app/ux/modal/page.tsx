'use client';

import Button from '@/components/ux/buttons/Button';
import Modal from '@/components/ux/modal/Modal';
import Typography from '@/components/ux/text/Typography';
import { useState } from 'react';

const ControlledModal = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
    <Button title = 'Open modal' value = {1} handleClick={() => setOpen(true)} />
    <Modal
      open = {open}
      onClose={() => setOpen(false)}
      {...props}
    >
      <Typography type = 'h6'>A modal title</Typography>
      <Typography type = 'body1'>Modal contents... you can put anything in as the children of a modal!</Typography>
    </Modal>
    </>
  );
};


export default function Page() {
  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Modal</Typography>

      <Typography type='h6' style={{ marginBottom: 10 }}>Standard</Typography>
      <ControlledModal />

      <Typography type='h6' style={{ marginBottom: 10 }}>Show close button</Typography>
      <ControlledModal showCloseButton />
    </div>
  );
}
