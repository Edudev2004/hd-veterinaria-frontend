import React, { useState } from 'react';
import { AuthProvider, useAuthContext } from './features/auth/context/AuthContext';
import { UsersProvider } from './features/users/context/UsersContext';
import { RolesProvider } from './features/roles/context/RolesContext';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RolesPage } from './features/roles/pages/RolesPage';
import { UsersPage } from './features/users/pages/UsersPage';
import { DashboardLayout } from './layouts/DashboardLayout';

function MainApp() {
  const { isAuthenticated } = useAuthContext();
  const [currentModule, setCurrentModule] = useState<'login' | 'users' | 'roles'>('users');

  if (!isAuthenticated || currentModule === 'login') {
    return <LoginPage onSuccessLogin={() => setCurrentModule('users')} />;
  }

  return (
    <DashboardLayout activeModule={currentModule} onNavigate={setCurrentModule}>
      {currentModule === 'users' && <UsersPage />}
      {currentModule === 'roles' && <RolesPage />}
    </DashboardLayout>
  );
}

export function App() {
  return (
    <AuthProvider>
      <UsersProvider>
        <RolesProvider>
          <MainApp />
        </RolesProvider>
      </UsersProvider>
    </AuthProvider>
  );
}

export default App;
