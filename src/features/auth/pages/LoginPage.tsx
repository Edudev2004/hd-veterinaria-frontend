import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { UnderlineInput } from '@/components/ui/UnderlineInput';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useLoadingNavigate } from '@/hooks/useLoadingNavigate';
import {
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  ShieldCheck,
  UserCheck,
  Sparkles
} from 'lucide-react';
import bgImage from '@/assets/images/vet_happy_pets_bg.jpg';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { loading, navigateWithLoader } = useLoadingNavigate(700);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }
    if (!password) {
      setError('Por favor, ingresa tu contraseña.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const user = await login({ email: email.trim(), password });

      // US-02: Redirigir con loader según el rol del usuario autenticado
      let targetPath = '/dashboard';
      if (user.rol === 'veterinario') {
        targetPath = '/veterinario/agenda';
      } else if (user.rol === 'admin') {
        targetPath = '/admin/dashboard';
      }
      navigateWithLoader(targetPath);
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ayudante para autocompletar credenciales de prueba
  const handleQuickFill = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('12345678');
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden font-sans bg-slate-100 text-slate-800">
      {/* Loader animado de transición */}
      <LoadingOverlay visible={loading} message="Iniciando sesión..." />

      {/* Background Image across full screen */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Soft overlay blending left dark/hero text with right bright card */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-slate-100/90 md:to-white/95" />
      </div>

      {/* Main Split Content Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col md:flex-row">
        
        {/* LEFT COLUMN: Hero Branding & Role Selector */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
          
          {/* Logo / Brand Header */}
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-10 h-10 rounded-xl bg-[#0D7C84] p-0.5 shadow-lg shadow-[#0D7C84]/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-[#0D7C84]" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">
              Vet<span className="text-[#F59E0B]">HD</span>
            </span>
          </Link>

          {/* Center Callout & Demo Credentials Helper */}
          <div className="my-auto py-10 max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F59E0B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acceso Unificado Multirrol</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
              Bienvenido <br />
              <span className="text-[#F59E0B]">de nuevo</span>
            </h1>

            <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-normal drop-shadow-md">
              Ingresa a la plataforma integral de salud animal. Consulta expedientes, gestiona citas médicas y monitorea el bienestar de tus pacientes o mascotas.
            </p>

            {/* Quick Demo Credentials Box */}
            <div className="pt-2 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                ⚡ Accesos de prueba rápida (1-click):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('propietario@vethd.com')}
                  className="px-3 py-2.5 rounded-xl bg-slate-900/60 hover:bg-[#0D7C84]/40 border border-slate-700/80 hover:border-[#0D7C84] text-left transition-all backdrop-blur-md group"
                >
                  <div className="flex items-center gap-1.5 text-[#F59E0B] text-xs font-bold">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Propietario</span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-0.5 truncate">/dashboard</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('veterinario@vethd.com')}
                  className="px-3 py-2.5 rounded-xl bg-slate-900/60 hover:bg-[#0D7C84]/40 border border-slate-700/80 hover:border-[#0D7C84] text-left transition-all backdrop-blur-md group"
                >
                  <div className="flex items-center gap-1.5 text-teal-300 text-xs font-bold">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Veterinario</span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-0.5 truncate">/agenda</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@vethd.com')}
                  className="px-3 py-2.5 rounded-xl bg-slate-900/60 hover:bg-[#0D7C84]/40 border border-slate-700/80 hover:border-[#0D7C84] text-left transition-all backdrop-blur-md group"
                >
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-0.5 truncate">/admin</p>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="text-xs text-slate-300 drop-shadow-md">
            © {new Date().getFullYear()} VetHD. Sistema de Gestión Veterinaria.
          </div>
        </div>

        {/* RIGHT COLUMN: Light Mode Glassmorphic Login Form Container */}
        <div className="w-full md:w-1/2 bg-white/95 md:bg-white/90 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-slate-200/80 p-8 sm:p-12 lg:p-16 flex flex-col justify-center shadow-2xl">
          <div className="max-w-md w-full mx-auto space-y-8">
            
            {/* Heading & Subtitle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Iniciar Sesión
                </h2>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#0D7C84] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Inicio</span>
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Ingresa con tu cuenta registrada para acceder a tu panel
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3 text-rose-600 text-xs sm:text-sm animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Correo Electrónico */}
              <UnderlineInput
                label="Correo Electrónico"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="ejemplo@correo.com"
                icon={<Mail className="w-4 h-4" />}
              />

              {/* Contraseña con Show / Hide Toggle */}
              <UnderlineInput
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Ingresa tu contraseña"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    className="focus:outline-none p-1 text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0D7C84] focus:ring-[#0D7C84]/30 cursor-pointer"
                  />
                  <span>Recordar sesión</span>
                </label>

                <Link
                  to="/recuperar-password"
                  className="font-semibold text-[#0D7C84] hover:text-[#0b686f] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  variant="primary"
                  fullWidth
                  className="!py-3.5 shadow-lg shadow-[#0D7C84]/25"
                >
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

            </form>

            {/* Footer Registration Link */}
            <div className="pt-4 border-t border-slate-200/80 text-center">
              <p className="text-xs sm:text-sm text-slate-600">
                ¿Aún no tienes una cuenta?{' '}
                <Link
                  to="/register"
                  className="font-extrabold text-[#0D7C84] hover:text-[#0b686f] hover:underline transition-colors"
                >
                  Regístrate aquí gratis
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
