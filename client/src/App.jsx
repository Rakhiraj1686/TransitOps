import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/protected/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import DashboardPage from './pages/dashboard/DashboardPage';
import VehiclesPage from './pages/vehicles/VehiclesPage';
import VehicleDetailsPage from './pages/vehicles/VehicleDetailsPage';
import DriversPage from './pages/drivers/DriversPage';
import TripsPage from './pages/trips/TripsPage';
import MaintenancePage from './pages/maintenance/MaintenancePage';
import FuelExpensePage from './pages/fuel/FuelExpensePage';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/errors/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/fuel" element={<FuelExpensePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
