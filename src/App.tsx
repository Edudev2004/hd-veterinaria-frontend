import React, { useState } from 'react';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RolesPage } from './features/roles/pages/RolesPage';
import { UsersPage } from './features/users/pages/UsersPage';
import { DashboardLayout } from './layouts/DashboardLayout';

export function App() {
  const [currentModule, setCurrentModule] = useState<'users' | 'roles' | 'login'>('users');

  if (currentModule === 'login') {
    return <LoginPage />;
  }

  return (
    <DashboardLayout activeModule={currentModule} onNavigate={setCurrentModule}>
      {currentModule === 'users' && <UsersPage />}
      {currentModule === 'roles' && <RolesPage />}
    </DashboardLayout>
  );
}

export default App;
