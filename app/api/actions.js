"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

function parsearFecha(fechaStr) {
  const str = String(fechaStr).trim();

  const match = str.match(/(\d{4})\D*(\d{2})\D*(\d{2})\D*(\d{2})\D*(\d{2})/);

  if (!match) {
    throw new Error(`Fecha inválida recibida: "${fechaStr}"`);
  }

  const [, year, month, day, hours, minutes] = match.map(Number);

  // Date.UTC evita que el servidor aplique su propia zona horaria
  return new Date(Date.UTC(year, month - 1, day, hours, minutes));
}
export async function guardarTurno(datos) {
  try {
    const fecha = parsearFecha(datos.fecha);
    await prisma.turnoMedico.create({
      data: {
        titulo: datos.titulo,
        fecha,
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
    const fecha = parsearFecha(datos.fecha);
    await prisma.turnoMedico.update({
      where: { id: Number(id) },
      data: {
        titulo: datos.titulo,
        fecha,
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
