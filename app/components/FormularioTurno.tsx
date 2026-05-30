"use client";

import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Normalizar fecha: tomar solo los primeros 16 chars "YYYY-MM-DDTHH:MM"
    const fechaStr = String(valores.fecha).trim().slice(0, 16);
    const [datePart, timePart] = fechaStr.split("T");
    const [year, month, day] = (datePart || "").split("-").map(Number);
    const [hours, minutes] = (timePart || "00:00").split(":").map(Number);

    const fechaValida = !isNaN(year) && !isNaN(month) && !isNaN(day);
    if (!fechaValida) {
      alert("La fecha no es válida, por favor seleccionala de nuevo.");
      return;
    }

    onSubmit({
      ...valores,
      fecha: `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 pt-1">
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
