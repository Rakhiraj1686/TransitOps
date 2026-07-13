import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/modals/Modal';
import { Field, Input, Select } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';
import api from '../../services/api';

const CATEGORIES = ['Toll', 'Fine', 'Insurance', 'Permit', 'Cleaning', 'Other'];

const ExpenseFormModal = ({ open, onClose, onSubmit, loading }) => {
  const [vehicles, setVehicles] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (open) {
      reset({ vehicle: '', category: 'Toll', description: '', amount: '', date: new Date().toISOString().slice(0, 10) });
      api.get('/vehicles', { params: { limit: 100, sort: 'name' } }).then((res) => setVehicles(res.data.data));
    }
  }, [open, reset]);

  return (
    <Modal open={open} onClose={onClose} title="Record Expense" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field label="Vehicle" hint="Optional — leave blank for general expenses">
          <Select {...register('vehicle')}>
            <option value="">No specific vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.registrationNumber} — {v.name}
              </option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-5">
          <Field label="Category">
            <Select {...register('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Date">
            <Input type="date" {...register('date')} />
          </Field>
          <Field label="Amount (₹)" required error={errors.amount?.message}>
            <Input type="number" {...register('amount', { required: 'Required', min: 0 })} />
          </Field>
          <Field label="Description" required error={errors.description?.message}>
            <Input placeholder="Highway toll" {...register('description', { required: 'Required' })} />
          </Field>
        </div>

        <div className="flex justify-end gap-3 border-t border-line pt-5 dark:border-white/10">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Record Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseFormModal;
