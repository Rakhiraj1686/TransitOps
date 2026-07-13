import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/modals/Modal';
import { Field, Input, Select } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';

const TYPES = ['Truck', 'Van', 'Mini Truck', 'Trailer', 'Bus', 'Pickup', 'Container Truck'];
const FUEL_TYPES = ['Diesel', 'Petrol', 'CNG', 'Electric'];
const STATUSES = ['Available', 'On Trip', 'In Shop', 'Retired'];

const VehicleFormModal = ({ open, onClose, onSubmit, initialData, loading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (open) {
      reset(
        initialData || {
          registrationNumber: '',
          name: '',
          type: 'Truck',
          maxCapacityKg: '',
          odometer: 0,
          purchaseCost: '',
          status: 'Available',
          region: '',
          manufacturer: '',
          year: new Date().getFullYear(),
          fuelType: 'Diesel',
        }
      );
    }
  }, [open, initialData, reset]);

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Vehicle' : 'Register Vehicle'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Registration Number" required error={errors.registrationNumber?.message}>
            <Input placeholder="MH-12-AB-1234" {...register('registrationNumber', { required: 'Required' })} />
          </Field>
          <Field label="Vehicle Name / Model" required error={errors.name?.message}>
            <Input placeholder="Tata Prima 3718" {...register('name', { required: 'Required' })} />
          </Field>
          <Field label="Vehicle Type" required>
            <Select {...register('type')}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Fuel Type" required>
            <Select {...register('fuelType')}>
              {FUEL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Max Capacity (kg)" required error={errors.maxCapacityKg?.message}>
            <Input type="number" step="1" {...register('maxCapacityKg', { required: 'Required', min: 1 })} />
          </Field>
          <Field label="Odometer (km)">
            <Input type="number" step="1" {...register('odometer')} />
          </Field>
          <Field label="Purchase Cost (₹)" required error={errors.purchaseCost?.message}>
            <Input type="number" step="1" {...register('purchaseCost', { required: 'Required', min: 0 })} />
          </Field>
          <Field label="Year">
            <Input type="number" {...register('year')} />
          </Field>
          <Field label="Manufacturer">
            <Input placeholder="Tata" {...register('manufacturer')} />
          </Field>
          <Field label="Region">
            <Input placeholder="North Zone" {...register('region')} />
          </Field>
          {initialData && (
            <Field label="Status">
              <Select {...register('status')}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </Field>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-line pt-5 dark:border-white/10">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? 'Save Changes' : 'Register Vehicle'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default VehicleFormModal;
