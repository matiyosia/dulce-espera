"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Heart, Clock } from "lucide-react";
import {
  obtenerTurnos,
  guardarTurno,
  eliminarTurno,
  actualizarTurno,
} from "./api/actions";

// Componentes modulares
import ContadorProgreso from "./components/ContadorProgreso";
import FormularioTurno from "./components/FormularioTurno";
import ListaTurnos from "./components/ListaTurnos";
import ReproductorLatidos from "./components/ReproductorLatidos";
import BotonInstalarPWA from "./components/BotonInstalarPWA";
import PantallaLogin from "./components/PantallaLogin";
import {
  solicitarPermisoNotificaciones,
  programarAlerta,
} from "../lib/notifications";

export default function Home() {
  const [turnos, setTurnos] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [turnoEnEdicion, setTurnoEnEdicion] = useState(null); // <- ESTADO NUEVO: Controla qué turno se está editando
  const [isPending, startTransition] = useTransition();
  const [acceso, setAcceso] = useState(false);
  const formRef = React.useRef();
  // Función limpia para refrescar la lista de turnos (reutilizable)
  const cargarDatos = async () => {
    try {
      const lista = await obtenerTurnos();
      setTurnos(lista);
    } catch (err) {
      console.error("Error al sincronizar datos con Supabase:", err);
    } finally {
      setCargandoLista(false);
    }
  };

  // Efecto de montaje corregido sin warnings de renderizado en cascada
  useEffect(() => {
    cargarDatos();
    solicitarPermisoNotificaciones();
  }, []);

  if (!acceso) return <PantallaLogin onAcceso={() => setAcceso(true)} />;

  // Manejador del formulario adaptado para altas y modificaciones
  const handleFormulario = async (e, valoresFormulario) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData();
    formData.append("titulo", valoresFormulario.titulo);
    formData.append("fecha", valoresFormulario.fecha);
    formData.append("doctor", valoresFormulario.doctor);
    formData.append("notas", valoresFormulario.notas);

    startTransition(async () => {
      let res;

      if (turnoEnEdicion) {
        res = await actualizarTurno(turnoEnEdicion.id, formData);
      } else {
        res = await guardarTurno(formData);
      }

      if (res?.success) {
        // --- AQUÍ ESTÁ EL CAMBIO ---
        // Al guardar exitosamente, programamos la alerta automáticamente
        programarAlerta(valoresFormulario);
        // ---------------------------

        form.reset();
        formRef.current?.reset();
        setTurnoEnEdicion(null);
        await cargarDatos();
      } else {
        alert(res?.error || "Error al procesar el turno");
      }
    });
  };

  // Manejador para borrar turnos de la base de datos
  const handleEliminar = async (id) => {
    if (!confirm("¿Querés borrar este turno médico?")) return;

    // Si borramos el mismo turno que estábamos editando, limpiamos el formulario
    if (turnoEnEdicion?.id === id) {
      setTurnoEnEdicion(null);
    }

    const res = await eliminarTurno(id);
    if (res?.success) {
      await cargarDatos();
    } else {
      alert(res?.error || "No se pudo eliminar");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] select-none overscroll-behavior-none max-w-md mx-auto space-y-6">
      {/* Cabecera */}
      <BotonInstalarPWA />
      <header className="text-center pt-2">
        <div className="inline-flex p-2.5 bg-neutral-900 rounded-full border border-neutral-800 mb-2">
          <Heart
            className="text-rose-500 fill-rose-500 animate-pulse"
            size={20}
          />
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-neutral-200">
          Nuestra Dulce Espera
        </h1>
      </header>

      {/* Contenido Principal con Arquitectura Limpia */}
      <main className="space-y-4 flex-1 justify-center flex flex-col">
        {/* 1. Sección del Contador y Métricas */}
        <ContadorProgreso cantidadTurnos={turnos.length} />

        {/* {latidos} */}
        <ReproductorLatidos />

        {/* 2. Bloque de Gestión de Turnos */}
        <div className="space-y-3 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-md">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center space-x-1">
            <Clock size={14} className="text-rose-400" />
            <span>Turnos y Controles Médicos</span>
          </h3>

          {/* Formulario conectado con los estados de edición */}
          <FormularioTurno
            ref={formRef}
            onSubmit={handleFormulario}
            isPending={isPending}
            turnoEnEdicion={turnoEnEdicion}
            onCancelarEdicion={() => setTurnoEnEdicion(null)}
          />

          {/* Listado con los disparadores para activar el modo edición */}
          <ListaTurnos
            turnos={turnos}
            cargando={cargandoLista}
            onEliminar={handleEliminar}
            onSeleccionarEditar={(turno) => setTurnoEnEdicion(turno)}
            turnoEnEdicionId={turnoEnEdicion?.id}
          />
        </div>
      </main>

      {/* Footer Estructurado para los Cuatro */}
      <footer className="text-center pt-4 border-t border-neutral-900/60">
        <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1.5">
          Para nosotros cuatro ❤️
        </div>
        <div className="flex justify-center items-center gap-1.5 text-[10px] text-neutral-400 font-medium">
          <span>Matias</span>
          <span className="text-neutral-600">•</span>
          <span>Nicole</span>
          <span className="text-neutral-600">•</span>
          <span>Joaquina</span>
          <span className="text-neutral-600">•</span>
          <span className="text-rose-400/90 animate-pulse font-semibold">
            Bebé ✨
          </span>
        </div>
      </footer>
    </div>
  );
}
