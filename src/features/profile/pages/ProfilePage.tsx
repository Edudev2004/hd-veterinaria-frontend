import React from "react";
import { Mail, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80";

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-outfit">
          Mi Perfil
        </h1>
        <p className="text-sm text-slate-500">
          Información personal y configuración de cuenta
        </p>
      </div>

      <div className="p-8 rounded-2xl border border-slate-200 bg-white max-w-md flex flex-col items-center text-center gap-4">
        <img
          src={DEFAULT_AVATAR}
          alt={user.nombre}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-100 shadow-sm"
        />
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-outfit">
            {user.nombre}
          </h2>
          <p className="text-xs text-slate-500 capitalize">{user.rol}</p>
        </div>

        <div className="w-full space-y-3 pt-4 border-t border-slate-100 text-left">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-700">{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-700">
              {user.telefono || "No especificado"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
