import React, { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { AlertPill } from '../../../components/ui/AlertPill';
import { DemoRoleSelector } from './DemoRoleSelector';

interface LoginFormProps {
  onLogin: (email: string, pass: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  isLocked: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  loading,
  error,
  isLocked
}) => {
  const [email, setEmail] = useState('admin@veterinariahd.com');
  const [password, setPassword] = useState('ClaveSegura2026');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  const handleDemoSelect = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 w-full max-w-md">
      {error && (
        <div className="mb-4">
          <AlertPill
            type={isLocked ? 'error' : 'warning'}
            title={error}
            badgeText={isLocked ? 'BLOQUEADO' : 'ALERTA'}
            icon={isLocked ? 'lock' : 'warning'}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Correo Electrónico"
          icon="mail"
          type="email"
          placeholder="usuario@veterinariahd.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLocked}
          required
        />

        <Input
          id="password"
          label="Contraseña"
          icon="lock"
          isPassword
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLocked}
          required
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
            />
            <span>Recordarme en este equipo</span>
          </label>

          <a href="#" className="font-semibold text-primary hover:underline">
            ¿Olvidaste tu clave?
          </a>
        </div>

        <Button
          type="submit"
          variant={isLocked ? 'danger' : 'primary'}
          isLoading={loading}
          disabled={isLocked}
          icon={isLocked ? 'lock' : 'verified_user'}
          className="w-full mt-2"
        >
          {isLocked ? 'Cuenta Bloqueada (5/5 intentos)' : 'Iniciar Sesión'}
        </Button>
      </form>

      <DemoRoleSelector onSelect={handleDemoSelect} />
    </div>
  );
};
