"use client";

import React, { useState, useEffect } from "react";
import { Download, Share, PlusSquare, X } from "lucide-react";

export default function BotonInstalarPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [esIOS, setEsIOS] = useState(false);
  const [mostrarBanner, setMostrarBanner] = useState(false);

  useEffect(() => {
    // 1. Detectar si es iOS (iPhone/iPad)
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setEsIOS(ios);

    // 2. Verificar si ya está instalada (para no mostrar el botón al vicio)
    const esPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;

    if (!esPWA) {
      setMostrarBanner(true);
    }

    // 3. Capturar el evento de instalación en Android/Chrome
    const capturarPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", capturarPrompt);

    return () =>
      window.removeEventListener("beforeinstallprompt", capturarPrompt);
  }, []);

  const manejarInstalacionAndroid = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setMostrarBanner(false);
    }
  };

  if (!mostrarBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-neutral-900/95 backdrop-blur-md border border-neutral-800 p-4 rounded-2xl shadow-xl z-50 flex flex-col space-y-3 animate-fade-in animate-bounce-short">
      <div className="flex justify-between items-start">
        <div className="flex space-x-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-neutral-700 shrink-0">
            <img
              src="/apple-icon.png"
              alt="Icono App"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-100">
              Instalar Aplicación
            </h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Llevá nuestro espacio familiar a la pantalla de tu celular.
            </p>
          </div>
        </div>
        <button
          onClick={() => setMostrarBanner(false)}
          className="text-neutral-500 hover:text-neutral-300 p-1"
        >
          <X size={14} />
        </button>
      </div>

      {esIOS ? (
        /* Guía visual nativa para iPhone */
        <div className="bg-neutral-950 border border-neutral-800/60 rounded-xl p-2.5 text-[10px] text-neutral-300 flex items-center justify-center space-x-2">
          <span>Tocá el botón</span>
          <Share size={14} className="text-sky-400 inline mx-0.5" />
          <span>luego</span>
          <PlusSquare size={14} className="text-neutral-200 inline mx-0.5" />
          <span className="font-semibold text-rose-400">
            "Agregar al inicio"
          </span>
        </div>
      ) : (
        /* Botón de un solo clic para Android */
        <button
          onClick={manejarInstalacionAndroid}
          className="w-full bg-neutral-100 hover:bg-neutral-200 text-black font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-[0.99]"
        >
          <Download size={14} />
          <span>Instalar en el Teléfono</span>
        </button>
      )}
    </div>
  );
}
