"use client";

import React, { useState, useEffect } from "react";
import { Heart, Hourglass, Calendar as CalendarIcon } from "lucide-react";

const FECHA_INICIO = new Date(2026, 3, 13); // FUM: 13 de Abril de 2026
const TOTAL_DIAS_EMBARAZO = 280;

const OBTENER_TAMAÑO_BEBE = (semana) => {
  if (semana < 5) return { fruta: "Semilla de Amapola", emoji: "🌱" };
  if (semana === 5) return { fruta: "Semilla de Sésamo", emoji: "📐" };
  if (semana === 6) return { fruta: "Granito de Lenteja", emoji: "🔍" };
  if (semana === 7) return { fruta: "Arándano", emoji: "🫐" };
  if (semana === 8) return { fruta: "Frambuesa", emoji: "🍓" };
  if (semana === 9) return { fruta: "Uva", emoji: "🍇" };
  if (semana === 10) return { fruta: "Champiñón", emoji: "🍄" };
  if (semana === 11) return { fruta: "Frutilla", emoji: "🍓" };
  if (semana === 12) return { fruta: "Ciruela", emoji: "🍑" };
  return { fruta: "¡Creciendo fuerte!", emoji: "✨" };
};

export default function ContadorProgreso({ cantidadTurnos }) {
  const [tiempo, setTiempo] = useState({
    semanas: 0,
    dias: 0,
    diasRestantes: 0,
    progreso: 0,
  });

  useEffect(() => {
    const hoy = new Date();
    const diferencia = hoy.getTime() - FECHA_INICIO.getTime();
    const transcurridos = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (transcurridos >= 0) {
      setTiempo({
        semanas: Math.floor(transcurridos / 7),
        dias: transcurridos % 7,
        diasRestantes: Math.max(TOTAL_DIAS_EMBARAZO - transcurridos, 0),
        progreso: Math.min((transcurridos / TOTAL_DIAS_EMBARAZO) * 100, 100),
      });
    }
  }, []);

  const tamañoActual = OBTENER_TAMAÑO_BEBE(tiempo.semanas);

  return (
    <div className="space-y-4">
      {/* Card Contador Principal */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 text-center space-y-3 shadow-xl">
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
          Estamos transitando la
        </p>
        <div>
          <span className="text-5xl font-extrabold block tracking-tighter text-neutral-50">
            {tiempo.semanas}{" "}
            <span className="text-xl font-light text-neutral-400">sem</span>
          </span>
          <span className="text-md font-medium text-neutral-400 block mt-0.5">
            + {tiempo.dias} {tiempo.dias === 1 ? "día" : "días"}
          </span>
        </div>
        <div className="pt-1">
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: `${tiempo.progreso}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-neutral-500 mt-1.5 font-medium">
            <span>Abril 2026</span>
            <span>{tiempo.progreso.toFixed(1)}%</span>
            <span>18 Ene 2027</span>
          </div>
        </div>
      </div>

      {/* Card de Tamaño Informativo */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 flex items-center space-x-3.5 shadow-md">
        <div className="text-2xl bg-neutral-950 p-2 rounded-xl border border-neutral-800">
          {tamañoActual.emoji}
        </div>
        <div>
          <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
            Tamaño aproximado
          </p>
          <p className="text-xs font-semibold text-neutral-200">
            Como un/a{" "}
            <span className="text-rose-400">{tamañoActual.fruta}</span>
          </p>
        </div>
      </div>

      {/* Grid de Métricas Secundarias */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 flex items-center space-x-3 shadow-md">
          <Hourglass className="text-amber-400" size={16} />
          <div>
            <p className="text-[9px] text-neutral-500 font-bold uppercase">
              Días restantes
            </p>
            <p className="text-sm font-semibold text-neutral-200">
              {tiempo.diasRestantes}
            </p>
          </div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 flex items-center space-x-3 shadow-md">
          <CalendarIcon className="text-sky-400" size={16} />
          <div>
            <p className="text-[9px] text-neutral-500 font-bold uppercase">
              Próximos Turnos
            </p>
            <p className="text-sm font-semibold text-neutral-200">
              {cantidadTurnos} agendados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
