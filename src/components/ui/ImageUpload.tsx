import React, { useRef, useState } from "react";
import {
  UploadCloud,
  CheckCircle2,
  Trash2,
  RefreshCw,
  AlertCircle,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import { uploadFile, validateImageFile } from "@/services/storageService";

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: "mascotas" | "avatares" | "general";
  shape?: "rounded" | "circle";
  helperText?: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = "Foto",
  value = "",
  onChange,
  folder = "general",
  shape = "rounded",
  helperText = "Formatos soportados: JPG, PNG, WEBP o GIF (máx. 10 MB)",
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  const handleProcessFile = async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || "Archivo no permitido");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await uploadFile(file, folder);
      onChange(res.url);
    } catch (err: any) {
      setUploadError(
        err?.message || "No se pudo subir la imagen a Supabase Storage.",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const handleRemove = () => {
    onChange("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isSupabaseUrl =
    typeof value === "string" && value.includes("supabase.co/storage");

  return (
    <div className="w-full space-y-2 text-left">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-rose-600 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Error al procesar la imagen</p>
            <p className="text-slate-600">{uploadError}</p>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-rose-400 hover:text-rose-700 font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Uploading State Overlay/Box */}
      {isUploading ? (
        <div className="p-6 border-2 border-dashed border-[#0D7C84]/40 bg-teal-50/50 rounded-2xl flex flex-col items-center justify-center gap-3 text-center animate-pulse">
          <div className="w-12 h-12 rounded-full bg-[#0D7C84]/10 flex items-center justify-center text-[#0D7C84]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              Subiendo a Supabase Storage...
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Optimizando y guardando de forma segura
            </p>
          </div>
        </div>
      ) : value ? (
        /* Preview with Image Loaded */
        <div className="relative border border-slate-200 bg-slate-50/80 rounded-2xl p-3.5 flex items-center gap-4 group">
          <div
            className={`relative overflow-hidden bg-white border border-slate-200 flex-shrink-0 ${
              shape === "circle" ? "w-20 h-20 rounded-full" : "w-20 h-20 rounded-xl"
            }`}
          >
            <img
              src={value}
              alt="Vista previa"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {isSupabaseUrl
                  ? "Foto alojada en Supabase Storage"
                  : "Imagen vinculada correctamente"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-xs" title={value}>
              {value}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D7C84] hover:text-[#09575d] bg-teal-50 hover:bg-teal-100/70 px-2.5 py-1 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Cambiar foto
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Quitar
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Dropzone / Select State */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
            isDragging
              ? "border-[#0D7C84] bg-teal-50/60 scale-[1.01]"
              : "border-slate-200 bg-white hover:border-[#0D7C84]/60 hover:bg-teal-50/20"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-11 h-11 rounded-full bg-teal-50 text-[#0D7C84] flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                <span className="text-[#0D7C84] underline underline-offset-2">
                  Haz clic para subir una foto
                </span>{" "}
                o arrástrala aquí
              </p>
              <p className="text-[11px] text-slate-500 mt-1">{helperText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Toggle manual URL input */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-[11px] font-medium text-slate-500 hover:text-[#0D7C84] inline-flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          {showManualUrl
            ? "Ocultar ingreso de URL manual"
            : "O ingresar enlace URL manualmente"}
        </button>
      </div>

      {showManualUrl && (
        <div className="pt-1 animate-in fade-in duration-200">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://ejemplo.com/foto.jpg"
            className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0D7C84] focus:ring-1 focus:ring-[#0D7C84]"
          />
        </div>
      )}
    </div>
  );
};
