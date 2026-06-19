"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface Props {
  open: boolean;

  title: string;

  onClose: () => void;

  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        {title}
      </DialogTitle>

      <DialogContent>
        Are you sure?
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={
            onConfirm
          }
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}