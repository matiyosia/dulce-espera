"use client";

import React, { useState, useRef } from "react";
import { Heart, Play, Pause, Volume2 } from "lucide-react";

export default function ReproductorLatidos() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const toggleReproduccion = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Error al reproducir el latido:", err);
        });
    }
  };

  // Cuando el video termina de reproducirse solo, volvemos el estado a pausado
  const handleTermino = () => {
    setIsPlaying(false);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-md flex flex-col space-y-3">
      {/* Elemento de video oculto (solo usamos su pista de audio/video controlada por JS) */}
      <video
        ref={videoRef}
        src="/latidos.mp4"
        preload="metadata"
        onEnded={handleTermino}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2.5 rounded-xl border border-neutral-800 transition-all bg-neutral-950 ${isPlaying ? "border-rose-500/30" : ""}`}
          >
            <Heart
              className={`text-rose-500 fill-rose-500 ${isPlaying ? "animate-bounce" : ""}`}
              size={18}
            />
          </div>
          <div>
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
              El Sonido Más Hermoso
            </p>
            <p className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
              Latidos del Corazón
              {isPlaying && (
                <Volume2 size={12} className="text-rose-400 animate-pulse" />
              )}
            </p>
          </div>
        </div>

        {/* Botón de control táctil tipo iOS */}
        <button
          onClick={toggleReproduccion}
          className={`flex items-center justify-center rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
            isPlaying
              ? "bg-neutral-950 border border-neutral-800 text-rose-400"
              : "bg-rose-600 hover:bg-rose-700 text-white shadow-md"
          }`}
        >
          {isPlaying ? (
            <div className="flex items-center space-x-1">
              <Pause size={12} className="fill-rose-400" />
              <span>Pausar</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <Play size={12} className="fill-white" />
              <span>Escuchar</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
