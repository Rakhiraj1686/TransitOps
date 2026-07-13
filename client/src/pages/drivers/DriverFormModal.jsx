import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/modals/Modal';
import { Field, Input, Select } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';

const CATEGORIES = ['LMV', 'HMV', 'HGMV', 'HPMV', 'Trailer', 'Motorcycle'];
const STATUSES = ['Available', 'On Trip', 'Off Duty', 'Suspended'];

const DriverFormModal = ({ open, onClose, onSubmit, initialData, loading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? { ...initialData, licenseExpiry: initialData.licenseExpiry?.slice(0, 10) }
          : {
              name: '',
              licenseNumber: '',
              licenseCategory: 'LMV',
              licenseExpiry: '',
              phone: '',
              email: '',
              safetyScore: 100,
              status: 'Available',
              address: '',
            }
      );
    }
  }, [open, initialData, reset]);

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Driver' : 'Add Driver'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Driver Name" required error={errors.name?.message}>
            <Input placeholder="Rahul Sharma" {...register('name', { required: 'Required' })} />
          </Field>
          <Field label="Phone Number" required error={errors.phone?.message}>
            <Input placeholder="+91-9XXXXXXXXX" {...register('phone', { required: 'Required' })} />
          </Field>
          <Field label="License Number" required error={errors.licenseNumber?.message}>
            <Input placeholder="DL-1234567890" {...register('licenseNumber', { required: 'Required' })} />
          </Field>
          <Field label="License Category" required>
            <Select {...register('licenseCategory')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="License Expiry" required error={errors.licenseExpiry?.message}>
            <Input type="date" {...register('licenseExpiry', { required: 'Required' })} />
          </Field>
          <Field label="Safety Score (0-100)">
            <Input type="number" min="0" max="100" {...register('safetyScore')} />
          </Field>
          <Field label="Email">
            <Input type="email" placeholder="driver@transitops.com" {...register('email')} />
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
          <Field label="Address" hint="Optional">
            <Input placeholder="City, State" {...register('address')} />
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end dark:border-white/10">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="w-full sm:w-auto">
            {initialData ? 'Save Changes' : 'Add Driver'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DriverFormModal;
