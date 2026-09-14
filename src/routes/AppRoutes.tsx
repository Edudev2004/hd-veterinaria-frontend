import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

// Public Landing & Auth Pages
import { LandingPage } from '@/features/landing/pages/LandingPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';

// Propietario Pages
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { PetsPage } from '@/features/pets/pages/PetsPage';
import { AppointmentsPage } from '@/features/appointments/pages/AppointmentsPage';
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage';
import { ReviewsPage } from '@/features/reviews/pages/ReviewsPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';

// Veterinario Pages
import { VetSchedulePage } from '@/features/appointments/pages/VetSchedulePage';
import { VetConsultationsPage } from '@/features/vet/pages/VetConsultationsPage';
import { VetMedicalHistoryPage } from '@/features/vet/pages/VetMedicalHistoryPage';
import { VetReviewsPage } from '@/features/vet/pages/VetReviewsPage';

// Admin Pages
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage';
import { AdminVetsPage } from '@/features/admin/pages/AdminVetsPage';
import { AdminSpecialtiesPage } from '@/features/admin/pages/AdminSpecialtiesPage';
import { AdminRolesPage } from '@/features/admin/pages/AdminRolesPage';
import { AdminReportsPage } from '@/features/admin/pages/AdminReportsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes (without MainLayout Sidebar) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Internal System Routes (with MainLayout Sidebar/Header) */}
      <Route element={<MainLayout />}>
        {/* Portal Propietario Routes */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="mascotas" element={<PetsPage />} />
        <Route path="citas" element={<AppointmentsPage />} />
        <Route path="notificaciones" element={<NotificationsPage />} />
        <Route path="valoraciones" element={<ReviewsPage />} />
        <Route path="perfil" element={<ProfilePage />} />

        {/* Panel Veterinario Routes */}
        <Route path="veterinario/agenda" element={<VetSchedulePage />} />
        <Route path="veterinario/atenciones" element={<VetConsultationsPage />} />
        <Route path="veterinario/historial" element={<VetMedicalHistoryPage />} />
        <Route path="veterinario/valoraciones" element={<VetReviewsPage />} />

        {/* Panel Administración Routes */}
        <Route path="admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="admin/veterinarios" element={<AdminVetsPage />} />
        <Route path="admin/especialidades" element={<AdminSpecialtiesPage />} />
        <Route path="admin/roles" element={<AdminRolesPage />} />
        <Route path="admin/reportes" element={<AdminReportsPage />} />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
