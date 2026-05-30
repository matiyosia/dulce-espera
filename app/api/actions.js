"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

// 1. OBTENER TODOS LOS TURNOS (Ordenados por fecha más cercana)
export async function obtenerTurnos() {
  try {
    const turnos = await prisma.turnoMedico.findMany({
      orderBy: {
        fecha: "asc",
      },
    });

    // Serializamos las fechas correctamente usando las propiedades del modelo de Prisma
    return turnos.map((turno) => ({
      ...turno,
      fecha: turno.fecha ? turno.fecha.toISOString() : null,
      createdAt: turno.createdAt ? turno.createdAt.toISOString() : null, // Mapeado según el schema (createdAt)
    }));
  } catch (error) {
    console.error("❌ Error en obtenerTurnos:", error);
    return [];
  }
}

// 2. GUARDAR UN NUEVO TURNO
export async function guardarTurno(formData) {
  const titulo = formData.get("titulo");
  const fecha = formData.get("fecha");
  const doctor = formData.get("doctor");
  const notas = formData.get("notas");

  if (!titulo || !fecha) {
    return { success: false, error: "El título y la fecha son obligatorios." };
  }

  try {
    await prisma.turnoMedico.create({
      data: {
        titulo,
        fecha: new Date(fecha),
        doctor: doctor || null,
        notes: notas || null, // Corregido: El modelo usa 'notes'
      },
    });

    // Fuerza a Next.js a refrescar los datos en la pantalla principal
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
      where: {
        id: Number(id),
      },
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
  const titulo = formData.get("titulo");
  const fecha = formData.get("fecha");
  const doctor = formData.get("doctor");
  const notas = formData.get("notas");

  if (!titulo || !fecha) {
    return { success: false, error: "El título y la fecha son obligatorios." };
  }

  try {
    await prisma.turnoMedico.update({
      where: {
        id: Number(id),
      },
      data: {
        titulo,
        fecha: new Date(fecha),
        doctor: doctor || null,
        notes: notas || null, // Corregido: El modelo usa 'notes'
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("❌ Error en actualizarTurno:", error);
    return { success: false, error: "No se pudo actualizar el turno." };
  }
}
