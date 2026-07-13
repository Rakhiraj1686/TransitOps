import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/modals/Modal';
import { Field, Input, Select, Textarea } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';
import { vehicleService } from '../../services/vehicleService';
import api from '../../services/api';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Pending', 'Approved', 'In Progress', 'Completed'];

const MaintenanceFormModal = ({ open, onClose, onSubmit, initialData, loading }) => {
  const [vehicles, setVehicles] = useState([]);
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
          vehicle: '',
          issue: '',
          priority: 'Medium',
          technician: '',
          cost: '',
          notes: '',
          status: 'Pending',
        }
      );
      if (!initialData) {
        // Any non-retired, non-on-trip vehicle can theoretically be sent for maintenance;
        // reuse the vehicle list endpoint with a broad query.
        api.get('/vehicles', { params: { limit: 100, sort: 'name' } }).then((res) => setVehicles(res.data.data));
      }
    }
  }, [open, initialData, reset]);

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Update Maintenance' : 'Log Maintenance'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {!initialData && (
            <Field label="Vehicle" required error={errors.vehicle?.message}>
              <Select {...register('vehicle', { required: 'Required' })}>
                <option value="">Select vehicle</option>
                {vehicles
                  .filter((v) => v.status !== 'On Trip' && v.status !== 'Retired')
                  .map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.registrationNumber} — {v.name}
                    </option>
                  ))}
              </Select>
            </Field>
          )}
          <Field label="Technician / Garage" required error={errors.technician?.message}>
            <Input placeholder="CityFix Garage" {...register('technician', { required: 'Required' })} />
          </Field>
          <Field label="Priority" required>
            <Select {...register('priority')}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Estimated / Final Cost (₹)">
            <Input type="number" {...register('cost', { min: 0 })} />
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
          <Field label="Issue Description" required error={errors.issue?.message} className="sm:col-span-2">
            <Textarea rows={3} placeholder="Describe the issue…" {...register('issue', { required: 'Required' })} />
          </Field>
        </div>

        <div className="flex justify-end gap-3 border-t border-line pt-5 dark:border-white/10">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? 'Save Changes' : 'Log Maintenance'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MaintenanceFormModal;
