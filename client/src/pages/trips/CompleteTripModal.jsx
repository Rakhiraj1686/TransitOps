import React from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/modals/Modal';
import { Field, Input } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';

const CompleteTripModal = ({ open, onClose, onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    if (open) reset({ endOdometer: '', fuelConsumedLtr: '', actualDistanceKm: '', revenue: '' });
  }, [open, reset]);

  return (
    <Modal open={open} onClose={onClose} title="Complete Trip" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field label="Final Odometer (km)" required error={errors.endOdometer?.message}>
          <Input type="number" {...register('endOdometer', { required: 'Required', min: 0 })} />
        </Field>
        <Field label="Fuel Consumed (L)" required error={errors.fuelConsumedLtr?.message}>
          <Input type="number" step="0.1" {...register('fuelConsumedLtr', { required: 'Required', min: 0 })} />
        </Field>
        <Field label="Actual Distance (km)">
          <Input type="number" {...register('actualDistanceKm', { min: 0 })} />
        </Field>
        <Field label="Trip Revenue (₹)" hint="Optional — used for ROI reporting">
          <Input type="number" {...register('revenue', { min: 0 })} />
        </Field>

        <div className="flex justify-end gap-3 border-t border-line pt-5 dark:border-white/10">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="success" loading={loading}>
            Mark Completed
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CompleteTripModal;
