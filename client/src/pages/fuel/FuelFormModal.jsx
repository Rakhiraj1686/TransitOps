import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/modals/Modal';
import { Field, Input, Select } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';
import api from '../../services/api';

const FuelFormModal = ({ open, onClose, onSubmit, loading }) => {
  const [vehicles, setVehicles] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (open) {
      reset({ vehicle: '', date: new Date().toISOString().slice(0, 10), quantityLtr: '', cost: '', odometerAtFillUp: '', station: '' });
      api.get('/vehicles', { params: { limit: 100, sort: 'name' } }).then((res) => setVehicles(res.data.data));
    }
  }, [open, reset]);

  return (
    <Modal open={open} onClose={onClose} title="Record Fuel Log" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field label="Vehicle" required error={errors.vehicle?.message}>
          <Select {...register('vehicle', { required: 'Required' })}>
            <option value="">Select vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.registrationNumber} — {v.name}
              </option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-5">
          <Field label="Date">
            <Input type="date" {...register('date')} />
          </Field>
          <Field label="Station">
            <Input placeholder="IndianOil" {...register('station')} />
          </Field>
          <Field label="Quantity (L)" required error={errors.quantityLtr?.message}>
            <Input type="number" step="0.1" {...register('quantityLtr', { required: 'Required', min: 0 })} />
          </Field>
          <Field label="Cost (₹)" required error={errors.cost?.message}>
            <Input type="number" {...register('cost', { required: 'Required', min: 0 })} />
          </Field>
          <Field label="Odometer at fill-up" className="col-span-2">
            <Input type="number" {...register('odometerAtFillUp', { min: 0 })} />
          </Field>
        </div>

        <div className="flex justify-end gap-3 border-t border-line pt-5 dark:border-white/10">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Record Fuel Log
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FuelFormModal;
