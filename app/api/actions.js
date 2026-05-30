"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function guardarTurno(datos) {
  try {
    if (!datos.fecha) {
      return { success: false, error: "La fecha es requerida" };
    }

    const fecha = new Date(datos.fecha);
    if (isNaN(fecha.getTime())) {
      return { success: false, error: "La fecha no es válida" };
    }

    await prisma.turnoMedico.create({
      data: {
        titulo: datos.titulo,
        fecha: fecha,
        doctor: datos.doctor || null,
        notes: datos.notas || null,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function actualizarTurno(id, datos) {
  try {
    await prisma.turnoMedico.update({
      where: { id: Number(id) },
      data: {
        titulo: datos.titulo,
        fecha: new Date(datos.fecha),
        doctor: datos.doctor || null,
        notes: datos.notas || null,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
// ... mantener obtenerTurnos y eliminarTurno igual

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
