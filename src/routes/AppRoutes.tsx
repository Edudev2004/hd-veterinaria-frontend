import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';

// Public Landing & Auth Pages
import { LandingPage } from '@/features/landing/pages/LandingPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { UnauthorizedPage } from '@/features/auth/pages/UnauthorizedPage';

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

// Route Guards (US-04: Protección de rutas por rol)
import { ProtectedRoute } from '@/routes/ProtectedRoute';

// Redirección inteligente al panel correspondiente según rol
const RoleBasedRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (user.rol === 'veterinario') return <Navigate to="/veterinario/agenda" replace />;
  if (user.rol === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Rutas Públicas (sin layout interno) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
      <Route path="/restablecer-password" element={<ResetPasswordPage />} />
      <Route path="/no-autorizado" element={<UnauthorizedPage />} />

      {/* 2. Rutas Protegidas del Sistema (Requieren Autenticación) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>

          {/* Área Propietario (Solo accesible con rol 'propietario') */}
          <Route element={<ProtectedRoute allowedRoles={['propietario']} />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="mascotas" element={<PetsPage />} />
            <Route path="citas" element={<AppointmentsPage />} />
            <Route path="notificaciones" element={<NotificationsPage />} />
            <Route path="valoraciones" element={<ReviewsPage />} />
            <Route path="perfil" element={<ProfilePage />} />
          </Route>

          {/* Área Veterinario (Solo accesible con rol 'veterinario') */}
          <Route element={<ProtectedRoute allowedRoles={['veterinario']} />}>
            <Route path="veterinario/agenda" element={<VetSchedulePage />} />
            <Route path="veterinario/atenciones" element={<VetConsultationsPage />} />
            <Route path="veterinario/atenciones/:citaId" element={<VetConsultationsPage />} />
            <Route path="veterinario/historial" element={<VetMedicalHistoryPage />} />
            <Route path="veterinario/valoraciones" element={<VetReviewsPage />} />
          </Route>

          {/* Área Administración (Solo accesible con rol 'admin') */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="admin/veterinarios" element={<AdminVetsPage />} />
            <Route path="admin/especialidades" element={<AdminSpecialtiesPage />} />
            <Route path="admin/roles" element={<AdminRolesPage />} />
            <Route path="admin/reportes" element={<AdminReportsPage />} />
          </Route>

          {/* Fallback para rutas desconocidas autenticadas */}
          <Route path="*" element={<RoleBasedRedirect />} />
        </Route>
      </Route>

      {/* Fallback global */}
      <Route path="*" element={<RoleBasedRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
