import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, ArrowRight, ArrowLeft, Stethoscope, MailCheck, Sparkles } from 'lucide-react';
import { requestPasswordReset } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { UnderlineInput } from '@/components/ui/UnderlineInput';
import bgImage from '@/assets/images/vet_happy_pets_bg.jpg';

export const ForgotPasswordPage: React.FC = () => {

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetData, setResetData] = useState<{ email: string; token: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const data = await requestPasswordReset(email.trim());
      setResetData(data);
    } catch (err: any) {
      setError(err?.message || 'Ocurrió un error al procesar la solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setError(null);
    setResetData(null);
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
        
        {/* LEFT COLUMN: Hero Information & Fast Fill */}
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
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seguridad de Acceso • US-05</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
              Recupera tu <br />
              <span className="text-[#F59E0B]">contraseña</span>
            </h1>

            <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-normal drop-shadow-md">
              No te preocupes, sucede a menudo. Ingresa la dirección de correo electrónico asociada a tu cuenta y te generaremos las instrucciones de restablecimiento de inmediato.
            </p>

            {/* Quick Demo Pill Helper */}
            <div className="pt-2 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                ⚡ Cuentas registradas para probar recuperación:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('propietario@vethd.com')}
                  className="px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-[#0D7C84]/40 border border-slate-700 text-xs text-slate-200 hover:text-white transition-all cursor-pointer"
                >
                  propietario@vethd.com
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('veterinario@vethd.com')}
                  className="px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-[#0D7C84]/40 border border-slate-700 text-xs text-slate-200 hover:text-white transition-all cursor-pointer"
                >
                  veterinario@vethd.com
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@vethd.com')}
                  className="px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-[#0D7C84]/40 border border-slate-700 text-xs text-slate-200 hover:text-white transition-all cursor-pointer"
                >
                  admin@vethd.com
                </button>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="text-xs text-slate-300 drop-shadow-md">
            © {new Date().getFullYear()} VetHD. Sistema de Gestión Veterinaria.
          </div>
        </div>

        {/* RIGHT COLUMN: Glassmorphic Form / Confirmation */}
        <div className="w-full md:w-1/2 bg-white/95 md:bg-white/90 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-slate-200/80 p-8 sm:p-12 lg:p-16 flex flex-col justify-center shadow-2xl">
          <div className="max-w-md w-full mx-auto space-y-8">
            
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {resetData ? '¡Correo Enviado!' : '¿Olvidaste tu clave?'}
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
                {resetData
                  ? 'Hemos procesado el envío del enlace de recuperación a tu correo.'
                  : 'Ingresa tu correo para recibir el enlace de restablecimiento seguro'}
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3 text-rose-600 text-xs sm:text-sm animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* FORM or MOCK CONFIRMATION CARD */}
            {!resetData ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <UnderlineInput
                  label="Correo Electrónico Registrado"
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

                <div className="pt-2">
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    variant="primary"
                    fullWidth
                    className="!py-3.5 shadow-lg shadow-[#0D7C84]/25"
                  >
                    <span>Enviar Enlace de Recuperación</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            ) : (
              /* Email Sent Confirmation Card */
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="p-6 rounded-2xl bg-teal-50/80 border border-[#0D7C84]/30 space-y-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#0D7C84] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#0D7C84]/25">
                    <MailCheck className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900">
                      Revisa tu correo electrónico
                    </h4>
                    <p className="text-xs text-slate-500">
                      Hemos enviado las instrucciones de restablecimiento a:
                    </p>
                    <p className="text-sm font-bold text-[#0D7C84] truncate">
                      {resetData.email}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    Por favor abre tu bandeja de entrada y haz clic en el enlace seguro dentro del correo para definir tu nueva contraseña. Si no lo encuentras en un par de minutos, revisa tu carpeta de spam o correo no deseado.
                  </p>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResetData(null);
                      setEmail('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-semibold cursor-pointer"
                  >
                    ¿No recibiste el correo? Intentar con otra dirección
                  </button>
                </div>
              </div>
            )}

            {/* Footer Back to Login Link */}
            <div className="pt-4 border-t border-slate-200/80 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0D7C84] hover:text-[#0b686f] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>¿Recordaste tu contraseña? Inicia sesión aquí</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
