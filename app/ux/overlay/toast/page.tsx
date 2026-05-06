'use client';


import Toast from '@/components/ux/overlay/Toast';
import Button from '@/components/ux/buttons/Button';
import Typography from '@/components/ux/text/Typography';
import { toaster } from '@esmalley/ts-utils';
import CodeBlock from '@/components/ux/text/CodeBlock';

export default function Page() {
  const showInfo = () => {
    toaster.add('This is an info toast!', 'info');
  };

  const showSuccess = () => {
    toaster.add('Operation successful!', 'success');
  };

  const showError = () => {
    toaster.add('An error occurred!', 'error');
  };


  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Toast</Typography>

      <Typography type='body1' style={{ marginBottom: 10 }}>Toasts are informational popups that will fade after a few seconds. They can contain import warning, error, success, or general info messages.</Typography>
      <Typography type='h6' style={{ marginBottom: 10 }}>Trigger Toasts</Typography>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Button title='Info' value={1} handleClick={showInfo} />
        <Button title='Success' value={2} handleClick={showSuccess} />
        <Button title='Error' value={3} handleClick={showError} />
      </div>

      <Toast />

      <CodeBlock code = {`
        import Toast from '@/components/ux/overlay/Toast';
        import { toaster } from '@esmalley/ts-utils';

        const showInfo = () => {
          toaster.add('This is an info toast!', 'info');
        };

        const showSuccess = () => {
          toaster.add('Operation successful!', 'success');
        };

        const showError = () => {
          toaster.add('An error occurred!', 'error');
        };

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Button title='Info' value={1} handleClick={showInfo} />
          <Button title='Success' value={2} handleClick={showSuccess} />
          <Button title='Error' value={3} handleClick={showError} />
        </div>

        <Toast />
      `} />
      <Typography type='body1' style={{ marginBottom: 10 }}>The toast needs to be put in the main body of you application, the toaster will talk with the toast from anywhere in the app.</Typography>
    </div>
  );
}
