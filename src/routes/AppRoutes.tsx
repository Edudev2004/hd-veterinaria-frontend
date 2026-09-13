import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

// Propietario Pages
import { DashboardPage } from '@/pages/DashboardPage';
import { PetsPage } from '@/pages/PetsPage';
import { AppointmentsPage } from '@/pages/AppointmentsPage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { ReviewsPage } from '@/pages/reviews/ReviewsPage';
import { ProfilePage } from '@/pages/ProfilePage';

// Veterinario Pages
import { VetSchedulePage } from '@/pages/vet/VetSchedulePage';
import { VetConsultationsPage } from '@/pages/vet/VetConsultationsPage';
import { VetMedicalHistoryPage } from '@/pages/vet/VetMedicalHistoryPage';
import { VetReviewsPage } from '@/pages/vet/VetReviewsPage';

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminVetsPage } from '@/pages/admin/AdminVetsPage';
import { AdminSpecialtiesPage } from '@/pages/admin/AdminSpecialtiesPage';
import { AdminRolesPage } from '@/pages/admin/AdminRolesPage';
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Default Redirect */}
        <Route index element={<Navigate to="/dashboard" replace />} />

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
