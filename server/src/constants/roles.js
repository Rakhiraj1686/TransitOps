const ROLES = Object.freeze({
  ADMIN: 'Admin',
  FLEET_MANAGER: 'Fleet Manager',
  DRIVER: 'Driver',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
});

const VEHICLE_STATUS = Object.freeze({
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  IN_SHOP: 'In Shop',
  RETIRED: 'Retired',
});

const DRIVER_STATUS = Object.freeze({
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  OFF_DUTY: 'Off Duty',
  SUSPENDED: 'Suspended',
});

const TRIP_STATUS = Object.freeze({
  DRAFT: 'Draft',
  DISPATCHED: 'Dispatched',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
});

const MAINTENANCE_STATUS = Object.freeze({
  PENDING: 'Pending',
  APPROVED: 'Approved',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
});

module.exports = { ROLES, VEHICLE_STATUS, DRIVER_STATUS, TRIP_STATUS, MAINTENANCE_STATUS };
