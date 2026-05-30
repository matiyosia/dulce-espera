export async function solicitarPermisoNotificaciones() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") return;
  await Notification.requestPermission();
}

export function programarAlerta(turno) {
  if (!("Notification" in window) || Notification.permission !== "granted")
    return;

  const fechaTurno = new Date(turno.fecha).getTime();
  const ahora = new Date().getTime();

  // Avisar 2 horas antes (o el tiempo que prefieras)
  const tiempoParaAviso = fechaTurno - 2 * 60 * 60 * 1000 - ahora;

  if (tiempoParaAviso > 0) {
    setTimeout(() => {
      new Notification("🍼 Recordatorio: Turno médico", {
        body: `Tenés un turno de ${turno.titulo} con ${turno.doctor || "el doctor"} en 2 horas.`,
        icon: "/apple-icon.png", // Asegurate de tener este icono en tu carpeta public
      });
    }, tiempoParaAviso);
  }
}
