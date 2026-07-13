import React from 'react';
import Modal from './Modal';
import Button from '../ui/Button';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmDialog = ({ open, onClose, onConfirm, title = 'Are you sure?', message, loading, confirmLabel = 'Confirm', danger = true }) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <div className="flex gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${danger ? 'bg-red-50 text-red-600 dark:bg-red-500/10' : 'bg-accent-light text-accent-dark'}`}>
        <FiAlertTriangle className="h-5 w-5" />
      </div>
      <p className="text-sm text-muted">{message}</p>
    </div>
    <div className="mt-6 flex justify-end gap-3">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
