"use client";

import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Plus, Loader2, Check, X } from "lucide-react";

export default forwardRef(function FormularioTurno(
  { onSubmit, isPending, turnoEnEdicion, onCancelarEdicion },
  ref,
) {
  const [valores, setValores] = useState({
    titulo: "",
    fecha: "",
    doctor: "",
    notas: "",
  });

  // Exponemos la función reset al componente padre
  useImperativeHandle(ref, () => ({
    reset: () => setValores({ titulo: "", fecha: "", doctor: "", notas: "" }),
  }));

  // Si cambia el turno en edición, llenamos los campos
  useEffect(() => {
    if (turnoEnEdicion) {
      const fechaLocal = new Date(turnoEnEdicion.fecha)
        .toISOString()
        .slice(0, 16);
      setValores({
        titulo: turnoEnEdicion.titulo,
        fecha: fechaLocal,
        doctor: turnoEnEdicion.doctor || "",
        notas: turnoEnEdicion.notas || "",
      });
    } else {
      setValores({ titulo: "", fecha: "", doctor: "", notas: "" });
    }
  }, [turnoEnEdicion]);

  const handleChange = (e) => {
    setValores({ ...valores, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={(e) => onSubmit(e, valores)} className="space-y-2 pt-1">
      <input
        type="text"
        name="titulo"
        required
        value={valores.titulo}
        onChange={handleChange}
        placeholder="Ej: Ecografía de Control"
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-500 text-neutral-100 transition-colors"
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          type="datetime-local"
          name="fecha"
          required
          value={valores.fecha}
          onChange={handleChange}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-500 text-neutral-100 transition-colors"
        />
        <input
          type="text"
          name="doctor"
          value={valores.doctor}
          onChange={handleChange}
          placeholder="Doctor o Clínica"
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-500 text-neutral-100 transition-colors"
        />
      </div>

      <input
        type="text"
        name="notas"
        value={valores.notas}
        onChange={handleChange}
        placeholder="Notas opcionales (ej: ir en ayunas)"
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-500 text-neutral-100 transition-colors"
      />

      <div className="flex gap-2">
        {turnoEnEdicion && (
          <button
            type="button"
            onClick={onCancelarEdicion}
            className="bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 p-2.5 rounded-xl text-xs flex items-center justify-center transition-all active:scale-[0.99]"
            title="Cancelar edición"
          >
            <X size={14} />
          </button>
        )}

        <button
          type="submit"
          disabled={isPending}
          className={`flex-1 font-semibold rounded-xl py-2.5 text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-[0.99] ${
            turnoEnEdicion
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "bg-rose-600 hover:bg-rose-700 text-white"
          }`}
        >
          {isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : turnoEnEdicion ? (
            <Check size={14} />
          ) : (
            <Plus size={14} />
          )}
          <span>
            {isPending
              ? turnoEnEdicion
                ? "Actualizando..."
                : "Agendando..."
              : turnoEnEdicion
                ? "Guardar Cambios"
                : "Agendar Turno"}
          </span>
        </button>
      </div>
    </form>
  );
});
