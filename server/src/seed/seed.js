const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');
const FuelLog = require('../models/FuelLog');
const Expense = require('../models/Expense');

const { ROLES, VEHICLE_STATUS, DRIVER_STATUS, TRIP_STATUS, MAINTENANCE_STATUS } = require('../constants/roles');

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const seed = async () => {
  await connectDB();
  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Vehicle.deleteMany({}),
    Driver.deleteMany({}),
    Trip.deleteMany({}),
    Maintenance.deleteMany({}),
    FuelLog.deleteMany({}),
    Expense.deleteMany({}),
  ]);

  console.log('Seeding users...');
  const users = await User.create([
    { name: 'Alex Rivera', email: 'admin@transitops.com', password: 'password123', role: ROLES.ADMIN },
    { name: 'Priya Nair', email: 'fleetmanager@transitops.com', password: 'password123', role: ROLES.FLEET_MANAGER },
    { name: 'Jordan Blake', email: 'driver@transitops.com', password: 'password123', role: ROLES.DRIVER },
    { name: 'Sam Okafor', email: 'safety@transitops.com', password: 'password123', role: ROLES.SAFETY_OFFICER },
    { name: 'Morgan Lee', email: 'finance@transitops.com', password: 'password123', role: ROLES.FINANCIAL_ANALYST },
  ]);
  const admin = users[0];

  console.log('Seeding vehicles...');
  const vehicleTypes = ['Truck', 'Van', 'Mini Truck', 'Trailer', 'Pickup', 'Container Truck'];
  const regions = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Hub'];
  const manufacturers = ['Tata', 'Ashok Leyland', 'Mahindra', 'Volvo', 'Eicher', 'BharatBenz'];

  const vehicles = [];
  for (let i = 1; i <= 24; i++) {
    vehicles.push({
      registrationNumber: `MH-${randInt(10, 49)}-${String.fromCharCode(65 + randInt(0, 25))}${String.fromCharCode(
        65 + randInt(0, 25)
      )}-${randInt(1000, 9999)}`,
      name: `${rand(manufacturers)} ${rand(['Prima', 'Ace', 'Bolero', 'Signature', 'Pro', 'LPT'])} ${randInt(407, 3718)}`,
      type: rand(vehicleTypes),
      maxCapacityKg: randInt(500, 18000),
      odometer: randInt(1000, 180000),
      purchaseCost: randInt(600000, 4500000),
      status: VEHICLE_STATUS.AVAILABLE,
      region: rand(regions),
      manufacturer: rand(manufacturers),
      year: randInt(2018, 2025),
      fuelType: rand(['Diesel', 'Diesel', 'Diesel', 'CNG', 'Electric']),
    });
  }
  const createdVehicles = await Vehicle.create(vehicles);

  // Set a few into non-Available states for a realistic dashboard
  createdVehicles[2].status = VEHICLE_STATUS.RETIRED;
  createdVehicles[5].status = VEHICLE_STATUS.RETIRED;
  await createdVehicles[2].save();
  await createdVehicles[5].save();

  console.log('Seeding drivers...');
  const firstNames = ['Rahul', 'Ananya', 'Vikram', 'Neha', 'Arjun', 'Kavya', 'Rohan', 'Divya', 'Karan', 'Sneha', 'Aditya', 'Meera', 'Ishaan', 'Pooja', 'Yash', 'Riya'];
  const lastNames = ['Sharma', 'Verma', 'Patel', 'Reddy', 'Iyer', 'Singh', 'Gupta', 'Das', 'Kulkarni', 'Menon'];
  const categories = ['LMV', 'HMV', 'HGMV', 'HPMV', 'Trailer'];

  const drivers = [];
  for (let i = 1; i <= 20; i++) {
    const expired = i <= 3; // first three have expired/expiring licenses for demo
    drivers.push({
      name: `${rand(firstNames)} ${rand(lastNames)}`,
      licenseNumber: `DL-${randInt(1000000000, 9999999999)}`,
      licenseCategory: rand(categories),
      licenseExpiry: expired ? daysFromNow(randInt(-20, 15)) : daysFromNow(randInt(60, 900)),
      phone: `+91-9${randInt(100000000, 999999999)}`,
      email: `driver${i}@transitops.com`,
      safetyScore: randInt(55, 100),
      status: DRIVER_STATUS.AVAILABLE,
      joiningDate: daysAgo(randInt(30, 1200)),
    });
  }
  const createdDrivers = await Driver.create(drivers);
  createdDrivers[18].status = DRIVER_STATUS.SUSPENDED;
  await createdDrivers[18].save();

  console.log('Seeding trips (historical, completed)...');
  const cities = ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Indore', 'Surat', 'Ahmedabad', 'Bengaluru', 'Hyderabad'];
  const trips = [];
  for (let i = 0; i < 60; i++) {
    const vehicle = rand(createdVehicles.filter((v) => v.status !== VEHICLE_STATUS.RETIRED));
    const driver = rand(createdDrivers.filter((d) => d.status !== DRIVER_STATUS.SUSPENDED));
    const distance = randInt(80, 1200);
    const createdAt = daysAgo(randInt(1, 180));
    trips.push({
      source: rand(cities),
      destination: rand(cities),
      vehicle: vehicle._id,
      driver: driver._id,
      cargoWeightKg: Math.min(randInt(200, 15000), vehicle.maxCapacityKg),
      plannedDistanceKm: distance,
      actualDistanceKm: distance + randInt(-10, 30),
      status: TRIP_STATUS.COMPLETED,
      dispatchedAt: createdAt,
      completedAt: new Date(createdAt.getTime() + randInt(3, 48) * 60 * 60 * 1000),
      fuelConsumedLtr: +(distance / randInt(4, 9)).toFixed(1),
      endOdometer: vehicle.odometer + distance,
      revenue: randInt(8000, 90000),
      createdBy: admin._id,
      createdAt,
      tripCode: `TRP-${String(i + 1).padStart(5, '0')}`,
    });
  }
  await Trip.create(trips);

  console.log('Seeding a few active trips (Draft / Dispatched)...');
  const freeVehicles = createdVehicles.filter((v) => v.status === VEHICLE_STATUS.AVAILABLE).slice(6, 12);
  const freeDrivers = createdDrivers.filter((d) => d.status === DRIVER_STATUS.AVAILABLE).slice(6, 12);

  for (let i = 0; i < 3; i++) {
    await Trip.create({
      source: rand(cities),
      destination: rand(cities),
      vehicle: freeVehicles[i]._id,
      driver: freeDrivers[i]._id,
      cargoWeightKg: Math.min(1500, freeVehicles[i].maxCapacityKg),
      plannedDistanceKm: randInt(100, 500),
      status: TRIP_STATUS.DRAFT,
      createdBy: admin._id,
    });
  }

  for (let i = 3; i < 6; i++) {
    freeVehicles[i].status = VEHICLE_STATUS.ON_TRIP;
    freeDrivers[i].status = DRIVER_STATUS.ON_TRIP;
    await freeVehicles[i].save();
    await freeDrivers[i].save();
    await Trip.create({
      source: rand(cities),
      destination: rand(cities),
      vehicle: freeVehicles[i]._id,
      driver: freeDrivers[i]._id,
      cargoWeightKg: Math.min(1200, freeVehicles[i].maxCapacityKg),
      plannedDistanceKm: randInt(100, 500),
      status: TRIP_STATUS.DISPATCHED,
      dispatchedAt: daysAgo(1),
      createdBy: admin._id,
    });
  }

  console.log('Seeding maintenance records...');
  const issues = ['Oil Change', 'Brake Pad Replacement', 'Tyre Rotation', 'Engine Diagnostics', 'AC Repair', 'Battery Replacement', 'Clutch Repair', 'Suspension Check'];
  const technicians = ['Ramesh Auto Works', 'CityFix Garage', 'Speedy Motors', 'Highway Service Center'];

  const maintenanceVehicle = createdVehicles[8];
  maintenanceVehicle.status = VEHICLE_STATUS.IN_SHOP;
  await maintenanceVehicle.save();
  await Maintenance.create({
    vehicle: maintenanceVehicle._id,
    issue: rand(issues),
    priority: 'High',
    technician: rand(technicians),
    status: MAINTENANCE_STATUS.IN_PROGRESS,
    cost: randInt(2000, 25000),
    createdBy: admin._id,
  });

  for (let i = 0; i < 15; i++) {
    const v = rand(createdVehicles);
    await Maintenance.create({
      vehicle: v._id,
      issue: rand(issues),
      priority: rand(['Low', 'Medium', 'High', 'Critical']),
      technician: rand(technicians),
      status: MAINTENANCE_STATUS.COMPLETED,
      cost: randInt(1500, 30000),
      startedAt: daysAgo(randInt(10, 150)),
      completedAt: daysAgo(randInt(1, 9)),
      createdBy: admin._id,
    });
  }

  console.log('Seeding fuel logs...');
  for (let i = 0; i < 80; i++) {
    const v = rand(createdVehicles);
    const qty = randInt(30, 400);
    await FuelLog.create({
      vehicle: v._id,
      date: daysAgo(randInt(1, 180)),
      quantityLtr: qty,
      cost: qty * randInt(88, 105),
      odometerAtFillUp: randInt(1000, 180000),
      station: rand(['IndianOil', 'HP Petrol', 'Bharat Petroleum', 'Shell']),
      createdBy: admin._id,
    });
  }

  console.log('Seeding expenses...');
  for (let i = 0; i < 40; i++) {
    const v = rand(createdVehicles);
    await Expense.create({
      vehicle: v._id,
      category: rand(['Toll', 'Fine', 'Insurance', 'Permit', 'Cleaning', 'Other']),
      description: rand(['Highway toll', 'Overspeeding fine', 'Annual insurance premium', 'State permit renewal', 'Vehicle wash', 'Parking charges']),
      amount: randInt(200, 45000),
      date: daysAgo(randInt(1, 180)),
      createdBy: admin._id,
    });
  }

  console.log('\n✅ Seed complete!\n');
  console.log('Demo login credentials (password: password123):');
  users.forEach((u) => console.log(`  ${u.role.padEnd(18)} -> ${u.email}`));

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
