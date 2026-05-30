"use client";
import { useState } from "react";

export default function PantallaLogin({ onAcceso }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const verificar = () => {
    if (pass === "joaquina24") {
      onAcceso();
    } else {
      setError("Contraseña incorrecta, intentá de nuevo.");
      setPass("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤍</span>
          </div>
          <h1 className="text-lg font-medium text-neutral-100">Dulce Espera</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Ingresá tu contraseña para continuar
          </p>
        </div>

        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && verificar()}
          placeholder="Contraseña"
          className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 placeholder-neutral-500 outline-none focus:border-neutral-500 mb-2"
        />

        {error && (
          <p className="text-xs text-rose-400 mb-3 text-center">{error}</p>
        )}

        <button
          onClick={verificar}
          className="w-full bg-neutral-100 hover:bg-white text-black font-medium py-3 rounded-xl transition-all mt-2"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
