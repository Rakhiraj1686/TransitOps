import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/modals/Modal';
import { Field, Input, Select } from '../../components/ui/Primitives';
import Button from '../../components/ui/Button';
import { vehicleService } from '../../services/vehicleService';
import { driverService } from '../../services/driverService';

const TripFormModal = ({ open, onClose, onSubmit, loading }) => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const selectedVehicleId = watch('vehicle');
  const cargoWeight = watch('cargoWeightKg');
  const selectedVehicle = vehicles.find((v) => v._id === selectedVehicleId);
  const overCapacity = selectedVehicle && cargoWeight && Number(cargoWeight) > selectedVehicle.maxCapacityKg;

  useEffect(() => {
    if (open) {
      reset({ source: '', destination: '', vehicle: '', driver: '', cargoWeightKg: '', plannedDistanceKm: '' });
      Promise.all([vehicleService.getAvailable(), driverService.getAvailable()]).then(([v, d]) => {
        setVehicles(v.data);
        setDrivers(d.data);
      });
    }
  }, [open, reset]);

  return (
    <Modal open={open} onClose={onClose} title="Create Trip" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Source" required error={errors.source?.message}>
            <Input placeholder="Mumbai" {...register('source', { required: 'Required' })} />
          </Field>
          <Field label="Destination" required error={errors.destination?.message}>
            <Input placeholder="Pune" {...register('destination', { required: 'Required' })} />
          </Field>

          <Field label="Vehicle" required error={errors.vehicle?.message} hint={vehicles.length === 0 ? 'No available vehicles right now' : undefined}>
            <Select {...register('vehicle', { required: 'Required' })}>
              <option value="">Select an available vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.registrationNumber} — {v.name} (max {v.maxCapacityKg}kg)
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Driver" required error={errors.driver?.message} hint={drivers.length === 0 ? 'No available drivers right now' : undefined}>
            <Select {...register('driver', { required: 'Required' })}>
              <option value="">Select an available driver</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} — {d.licenseNumber}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Cargo Weight (kg)" required error={errors.cargoWeightKg?.message || (overCapacity ? `Exceeds vehicle capacity of ${selectedVehicle.maxCapacityKg}kg` : undefined)}>
            <Input type="number" step="1" {...register('cargoWeightKg', { required: 'Required', min: 0 })} />
          </Field>

          <Field label="Planned Distance (km)" required error={errors.plannedDistanceKm?.message}>
            <Input type="number" step="1" {...register('plannedDistanceKm', { required: 'Required', min: 0 })} />
          </Field>
        </div>

        <div className="flex justify-end gap-3 border-t border-line pt-5 dark:border-white/10">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={overCapacity}>
            Create Trip (Draft)
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TripFormModal;
