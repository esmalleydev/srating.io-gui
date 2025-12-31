'use client';

import { useTheme } from "@/components/hooks/useTheme";
import Button from "../buttons/Button";
import Typography from "../text/Typography";
import Modal from "./Modal";


const ErrorModal = (
  {
    open,
    title = 'Error',
    message,
    confirm,
    confirmText = 'Ok'
  }:
  {
    open: boolean;
    title?: string;
    message: string;
    confirm: () => void;
    confirmText?: string;
  },
) => {
  const theme = useTheme();

  const handleClose = () => {
    confirm();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Typography type = 'h6'>{title}</Typography>
      <Typography type = 'body1' style = {{ color: theme.text.secondary, padding: '5px' }}>{message}</Typography>
      <div style = {{ textAlign: 'right', marginTop: 10 }}>
        <Button handleClick={handleClose} autoFocus title = {confirmText} value = 'confirm' ink />
      </div>
    </Modal>
  );
};

export default ErrorModal;
