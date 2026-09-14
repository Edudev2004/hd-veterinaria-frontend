import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, Stethoscope, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';
import { resetPassword } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { UnderlineInput } from '@/components/ui/UnderlineInput';
import bgImage from '@/assets/images/vet_happy_pets_bg.jpg';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Enlace inválido o incompleto. Solicita una nueva recuperación.');
      return;
    }

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden. Verifícalas cuidadosamente.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await resetPassword(email, newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Error al restablecer la contraseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden font-sans bg-slate-100 text-slate-800">
      {/* Background Image across full screen */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-slate-100/90 md:to-white/95" />
      </div>

      {/* Main Split Content Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col md:flex-row">
        
        {/* LEFT COLUMN: Hero Brand & Info */}
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

          {/* Center Info */}
          <div className="my-auto py-10 max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F59E0B] text-xs font-bold uppercase tracking-wider">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Restablecimiento Seguro • US-05</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
              Define tu nueva <br />
              <span className="text-[#F59E0B]">credencial</span>
            </h1>

            <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-normal drop-shadow-md">
              Crea una contraseña segura de mínimo 8 caracteres que no hayas utilizado anteriormente en otras plataformas.
            </p>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Recomendaciones de Seguridad:</span>
              </div>
              <ul className="text-xs text-slate-200 space-y-1 list-disc list-inside font-medium">
                <li>Al menos 8 caracteres de longitud.</li>
                <li>Combina mayúsculas, minúsculas y números.</li>
                <li>No compartas tus credenciales de acceso con terceros.</li>
              </ul>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="text-xs text-slate-300 drop-shadow-md">
            © {new Date().getFullYear()} VetHD. Sistema de Gestión Veterinaria.
          </div>
        </div>

        {/* RIGHT COLUMN: Reset Form / Success Card */}
        <div className="w-full md:w-1/2 bg-white/95 md:bg-white/90 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-slate-200/80 p-8 sm:p-12 lg:p-16 flex flex-col justify-center shadow-2xl">
          <div className="max-w-md w-full mx-auto space-y-8">
            
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {isSuccess ? '¡Listo!' : 'Nueva Clave'}
                </h2>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#0D7C84] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver</span>
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {isSuccess
                  ? 'Tu contraseña ha sido actualizada exitosamente en el sistema.'
                  : 'Ingresa y confirma tu nueva contraseña para continuar'}
              </p>
            </div>

            {/* Target Account Badge */}
            {email && !isSuccess && (
              <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs gap-2">
                <span className="text-slate-500 font-medium">Cuenta a actualizar:</span>
                <div className="flex items-center gap-2">
                  <strong className="text-slate-800 font-bold truncate max-w-[180px]">{email}</strong>
                  {token && (
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                      Token OK
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Warning if no email provided */}
            {!email && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3 text-amber-800 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                  <p>
                    No se detectó un correo válido en el enlace. Es necesario solicitar un nuevo enlace de recuperación.
                  </p>
                </div>
                <Link
                  to="/recuperar-password"
                  className="inline-flex items-center gap-1.5 font-bold text-[#0D7C84] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Ir a Recuperar Contraseña</span>
                </Link>
              </div>
            )}

            {/* Error Message Alert */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3 text-rose-600 text-xs sm:text-sm animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* FORM or SUCCESS CARD */}
            {!isSuccess ? (
              email && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nueva Contraseña */}
                  <UnderlineInput
                    label="Nueva Contraseña"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Mínimo 8 caracteres"
                    icon={<Lock className="w-4 h-4" />}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                        className="focus:outline-none p-1 text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  {/* Confirmar Nueva Contraseña */}
                  <UnderlineInput
                    label="Confirmar Nueva Contraseña"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Repite la contraseña"
                    icon={<Lock className="w-4 h-4" />}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                        className="focus:outline-none p-1 text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      variant="primary"
                      fullWidth
                      className="!py-3.5 shadow-lg shadow-[#0D7C84]/25"
                    >
                      <span>Guardar Nueva Contraseña</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              )
            ) : (
              /* Success Card */
              <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    ¡Contraseña Actualizada!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                    Tu contraseña ha sido modificada correctamente. Ahora puedes iniciar sesión con tu nueva clave de acceso.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={() => navigate('/login')}
                    variant="primary"
                    fullWidth
                    className="!py-3.5 shadow-lg shadow-[#0D7C84]/25"
                  >
                    <span>Iniciar Sesión Ahora</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Back link */}
            <div className="pt-4 border-t border-slate-200/80 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0D7C84] hover:text-[#0b686f] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a Iniciar Sesión</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetPasswordPage;
