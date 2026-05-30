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

  useImperativeHandle(ref, () => ({
    reset: () => setValores({ titulo: "", fecha: "", doctor: "", notas: "" }),
  }));

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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(valores); // Pasamos solo el objeto, sin el evento 'e'
      }}
      className="space-y-2 pt-1"
    >
      <input
        type="text"
        name="titulo"
        required
        value={valores.titulo}
        onChange={(e) => setValores({ ...valores, titulo: e.target.value })}
        placeholder="Ej: Ecografía de Control"
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-500 text-neutral-100"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="datetime-local"
          name="fecha"
          required
          value={valores.fecha}
          onChange={(e) => setValores({ ...valores, fecha: e.target.value })}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-500 text-neutral-100"
        />
        <input
          type="text"
          name="doctor"
          value={valores.doctor}
          onChange={(e) => setValores({ ...valores, doctor: e.target.value })}
          placeholder="Doctor"
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-500 text-neutral-100"
        />
      </div>
      <input
        type="text"
        name="notas"
        value={valores.notas}
        onChange={(e) => setValores({ ...valores, notas: e.target.value })}
        placeholder="Notas opcionales"
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-rose-500 text-neutral-100"
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-rose-600 py-2.5 rounded-xl text-white font-semibold text-xs"
      >
        {isPending
          ? "Procesando..."
          : turnoEnEdicion
            ? "Guardar Cambios"
            : "Agendar Turno"}
      </button>
    </form>
  );
});
