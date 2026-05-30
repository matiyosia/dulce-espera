"use client";

import React from "react";
import { Calendar, User, FileText, Trash2, Loader2 } from "lucide-react";

export default function ListaTurnos({ turnos, cargando, onEliminar }) {
  // Función para inyectar el evento con dos alertas nativas en iOS
  const descargarCalendarioICS = (turno) => {
    const fechaTurno = new Date(turno.fecha);
    const formatearFechaICS = (date) =>
      date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const fechaFin = new Date(fechaTurno.getTime() + 60 * 60 * 1000); // Duración de 1 hora

    const contenidoICS = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Nuestra Dulce Espera//Turnos Medicos//ES",
      "BEGIN:VEVENT",
      `UID:turno-${turno.id}@dulceespera.app`,
      `DTSTAMP:${formatearFechaICS(new Date())}`,
      `DTSTART:${formatearFechaICS(fechaTurno)}`,
      `DTEND:${formatearFechaICS(fechaFin)}`,
      `SUMMARY:${turno.titulo}`,
      `DESCRIPTION:Doctor/Clínica: ${turno.doctor || "No especificado"}\\nNotas: ${turno.notas || "Sin notas"}`,

      // ALERTA 1: 1 Día Antes (1440 minutos antes)
      "BEGIN:VALARM",
      "TRIGGER:-PT1440M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Recordatorio: Mañana tenés turno médico",
      "END:VALARM",

      // ALERTA 2: En el momento del turno (0 minutos)
      "BEGIN:VALARM",
      "TRIGGER:-PT0M",
      "ACTION:DISPLAY",
      "DESCRIPTION:¡Es hora de tu turno médico!",
      "END:VALARM",

      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([contenidoICS], {
      type: "text/calendar;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `turno-${turno.titulo.replace(/\s+/g, "_")}.ics`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-6 text-neutral-500 space-x-1.5">
        <Loader2 size={12} className="animate-spin text-rose-500" />
        <span className="text-[11px]">Sincronizando con Supabase...</span>
      </div>
    );
  }

  if (turnos.length === 0) {
    return (
      <p className="text-[11px] text-neutral-500 text-center py-4">
        No hay turnos médicos programados.
      </p>
    );
  }

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pt-2 divide-y divide-neutral-800/60 custom-scrollbar">
      {turnos.map((turno) => (
        <div
          key={turno.id}
          className="pt-2.5 first:pt-0 flex items-center justify-between space-x-2"
        >
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-neutral-200 truncate">
              {turno.titulo}
            </h4>
            <div className="text-[10px] text-neutral-400 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="flex items-center text-sky-400">
                <Calendar size={10} className="mr-0.5" />
                {new Date(turno.fecha).toLocaleString([], {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                hs
              </span>
              {turno.doctor && (
                <span className="flex items-center text-amber-400 truncate max-w-[120px]">
                  <User size={10} className="mr-0.5" />
                  <span className="truncate">{turno.doctor}</span>
                </span>
              )}
            </div>
            {turno.notas && (
              <p className="text-[9px] text-neutral-500 mt-0.5 flex items-center truncate">
                <FileText size={8} className="mr-0.5" />
                <span className="truncate">{turno.notas}</span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => descargarCalendarioICS(turno)}
              className="bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-[9px] text-rose-400 px-2 py-1.5 rounded-lg font-bold transition-all active:scale-95"
              title="Sincronizar alertas con iPhone (Día anterior y momento del turno)"
            >
              🔔 Alerta
            </button>
            <button
              onClick={() => onEliminar(turno.id)}
              className="text-neutral-500 hover:text-rose-500 p-1.5 rounded-lg hover:bg-neutral-950 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
