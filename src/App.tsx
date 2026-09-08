import React, { useState } from 'react';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RolesPage } from './features/roles/pages/RolesPage';
import { UsersPage } from './features/users/pages/UsersPage';
import { DashboardLayout } from './layouts/DashboardLayout';

export function App() {
  // El flujo por defecto inicia en la pantalla de Login
  const [currentModule, setCurrentModule] = useState<'login' | 'users' | 'roles'>('login');

  if (currentModule === 'login') {
    return <LoginPage onSuccessLogin={() => setCurrentModule('users')} />;
  }

  return (
    <DashboardLayout activeModule={currentModule} onNavigate={setCurrentModule}>
      {currentModule === 'users' && <UsersPage />}
      {currentModule === 'roles' && <RolesPage />}
    </DashboardLayout>
  );
}

export default App;
