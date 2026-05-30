"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

// Función auxiliar para obtener valores de forma flexible (a prueba de prefijos de Next.js)
function obtenerValor(formData, nombre) {
  // Primero intenta obtenerlo por el nombre exacto,
  // si no, busca con el posible prefijo que Next.js añade internamente
  return (
    formData.get(nombre) ||
    formData.get(`_1_${nombre}`) ||
    formData.get(`$ACTION_ID_0_${nombre}`)
  );
}

// 1. OBTENER TODOS LOS TURNOS
export async function obtenerTurnos() {
  try {
    const turnos = await prisma.turnoMedico.findMany({
      orderBy: { fecha: "asc" },
    });

    return turnos.map((turno) => ({
      ...turno,
      fecha: turno.fecha ? turno.fecha.toISOString() : null,
      createdAt: turno.createdAt ? turno.createdAt.toISOString() : null,
    }));
  } catch (error) {
    console.error("❌ Error en obtenerTurnos:", error);
    return [];
  }
}

// 2. GUARDAR UN NUEVO TURNO
export async function guardarTurno(formData) {
  const titulo = obtenerValor(formData, "titulo");
  const fecha = obtenerValor(formData, "fecha");
  const doctor = obtenerValor(formData, "doctor");
  const notas = obtenerValor(formData, "notas");

  if (!titulo || !fecha) {
    return { success: false, error: "El título y la fecha son obligatorios." };
  }

  try {
    await prisma.turnoMedico.create({
      data: {
        titulo,
        fecha: new Date(fecha),
        doctor: doctor || null,
        notes: notas || null,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("❌ Error en guardarTurno:", error);
    return { success: false, error: "No se pudo guardar en la base de datos." };
  }
}

// 3. ELIMINAR UN TURNO
export async function eliminarTurno(id) {
  try {
    await prisma.turnoMedico.delete({
      where: { id: Number(id) },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("❌ Error en eliminarTurno:", error);
    return { success: false, error: "No se pudo eliminar el turno." };
  }
}

// 4. ACTUALIZAR UN TURNO EXISTENTE
export async function actualizarTurno(id, formData) {
  const titulo = obtenerValor(formData, "titulo");
  const fecha = obtenerValor(formData, "fecha");
  const doctor = obtenerValor(formData, "doctor");
  const notas = obtenerValor(formData, "notas");

  if (!titulo || !fecha) {
    return { success: false, error: "El título y la fecha son obligatorios." };
  }

  try {
    await prisma.turnoMedico.update({
      where: { id: Number(id) },
      data: {
        titulo,
        fecha: new Date(fecha),
        doctor: doctor || null,
        notes: notas || null,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("❌ Error en actualizarTurno:", error);
    return { success: false, error: "No se pudo actualizar el turno." };
  }
}
