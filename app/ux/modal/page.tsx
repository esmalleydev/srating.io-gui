'use client';

import Button from '@/components/ux/buttons/Button';
import Modal from '@/components/ux/modal/Modal';
import Typography from '@/components/ux/text/Typography';
import CodeBlock from '@/components/ux/text/CodeBlock';
import Divider from '@/components/ux/display/Divider';
import { useState } from 'react';

const ControlledModal = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button title='Open modal' value={1} handleClick={() => setOpen(true)} />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        {...props}
      >
        <Typography type='h6'>A modal title</Typography>
        <Typography type='body1'>Modal contents... you can put anything in as the children of a modal!</Typography>
      </Modal>
    </>
  );
};

const CustomModal = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button title='Open modal' value={1} handleClick={() => setOpen(true)} />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        {...props}
      >
        <div style = {{ backgroundColor: 'orange', width: 400 }}>
          <Typography type='h6'>A modal title</Typography>
          <Typography type='body1'>Modal contents... you can put anything in as the children of a modal!</Typography>
        </div>
      </Modal>
    </>
  );
};

export default function Page() {
  return (
    <div style={{ padding: 20 }}>
      <Typography type='h5' style={{ marginBottom: 20 }}>Modal</Typography>

      <Typography type='h6' style={{ marginBottom: 10 }}>Standard</Typography>
      <ControlledModal />
      <CodeBlock code={`
        const ControlledModal = (props) => {
          const [open, setOpen] = useState(false);

          return (
            <>
              <Button title='Open modal' value={1} handleClick={() => setOpen(true)} />
              <Modal
                open={open}
                onClose={() => setOpen(false)}
                {...props}
              >
                <Typography type='h6'>A modal title</Typography>
                <Typography type='body1'>Modal contents... you can put anything in as the children of a modal!</Typography>
              </Modal>
            </>
          );
        };

        <ControlledModal />
      `} />
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Show close button</Typography>
      <ControlledModal showCloseButton />
      <CodeBlock code={`
        const ControlledModal = (props) => {
          const [open, setOpen] = useState(false);

          return (
            <>
              <Button title='Open modal' value={1} handleClick={() => setOpen(true)} />
              <Modal
                open={open}
                onClose={() => setOpen(false)}
                {...props}
              >
                <Typography type='h6'>A modal title</Typography>
                <Typography type='body1'>Modal contents... you can put anything in as the children of a modal!</Typography>
              </Modal>
            </>
          );
        };

        <ControlledModal showCloseButton />
      `} />
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Custom Type</Typography>
      <CustomModal type="custom" />
      <CodeBlock code={`
        const CustomModal = (props) => {
          const [open, setOpen] = useState(false);

          return (
            <>
              <Button title='Open modal' value={1} handleClick={() => setOpen(true)} />
              <Modal
                open={open}
                onClose={() => setOpen(false)}
                {...props}
              >
                <div style = {{ backgroundColor: 'orange', width: 400 }}>
                  <Typography type='h6'>A modal title</Typography>
                  <Typography type='body1'>Modal contents... you can put anything in as the children of a modal!</Typography>
                </div>
              </Modal>
            </>
          );
        };
  
        <CustomModal type="custom" />
      `} />
    </div>
  );
}



