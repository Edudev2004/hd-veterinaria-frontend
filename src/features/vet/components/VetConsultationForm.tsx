import React, { useEffect, useState } from 'react';
import type { GuardarAtencionInput } from '../types/vetConsultation.types';

type ValoresFormulario = Pick<
  GuardarAtencionInput,
  'diagnostico' | 'tratamiento' | 'notas'
>;

interface VetConsultationFormProps {
  initialValues?: ValoresFormulario;
  guardando?: boolean;
  onSubmit: (values: ValoresFormulario) => Promise<void> | void;
}

const valoresIniciales: ValoresFormulario = {
  diagnostico: '',
  tratamiento: '',
  notas: ''
};

export const VetConsultationForm: React.FC<VetConsultationFormProps> = ({
  initialValues,
  guardando = false,
  onSubmit
}) => {
  const [values, setValues] = useState<ValoresFormulario>(
    initialValues ?? valoresIniciales
  );
  const [error, setError] = useState('');

  useEffect(() => {
    setValues(initialValues ?? valoresIniciales);
  }, [initialValues]);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (!values.diagnostico.trim() || !values.tratamiento.trim()) {
      setError('Completa el diagnóstico y el tratamiento para continuar.');
      return;
    }

    setError('');

    await onSubmit({
      diagnostico: values.diagnostico.trim(),
      tratamiento: values.tratamiento.trim(),
      notas: values.notas.trim()
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          Registro clínico
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Registra el diagnóstico y tratamiento indicado para esta cita.
        </p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-slate-700">
          Diagnóstico
        </span>
        <textarea
          name="diagnostico"
          value={values.diagnostico}
          onChange={handleChange}
          rows={4}
          placeholder="Describe el diagnóstico del paciente..."
          className="resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-primary"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-slate-700">
          Tratamiento
        </span>
        <textarea
          name="tratamiento"
          value={values.tratamiento}
          onChange={handleChange}
          rows={4}
          placeholder="Indica medicamentos, cuidados o procedimientos..."
          className="resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-primary"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-slate-700">
          Notas adicionales
        </span>
        <textarea
          name="notas"
          value={values.notas}
          onChange={handleChange}
          rows={3}
          placeholder="Observaciones para el seguimiento del paciente..."
          className="resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-primary"
        />
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={guardando}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {guardando ? 'Guardando...' : 'Guardar atención'}
        </button>
      </div>
    </form>
  );
};