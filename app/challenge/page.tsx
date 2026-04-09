"use client";

import { useState } from "react";
import Image from "next/image";

export default function Challenge() {
  const [challenge, setChallenge] = useState(1);
  const [flag, setFlag] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        challenge_id: challenge,
        flag,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMsg(data.message);
    } else {
      setMsg(data.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* NAV */}
      <header className="w-full border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center px-6 py-3">
          <Image src="/logo.png" alt="logo" width={110} height={40} />
          <h1 className="text-2xl ml-3 hidden md:block font-bold text-primary">
            RED HACK
          </h1>
        </div>
      </header>

      {/* CONTEÚDO */}
      <section className="flex flex-1 items-center justify-center px-6">
        <div className="bg-black/70 p-8 rounded-xl w-full max-w-md border border-white/10">

          <h2 className="text-2xl font-bold text-primary mb-6 text-center">
            Submeter Flag
          </h2>

          {/* SELECT */}
          <label className="text-sm text-zinc-400 mb-2 block">
            Escolha o desafio
          </label>

          <select
            value={challenge}
            onChange={(e) => setChallenge(Number(e.target.value))}
            className="w-full mb-4 p-3 rounded bg-black border border-white/20"
          >
            {[1,2,3,4,5].map((num) => (
              <option key={num} value={num}>
                Desafio {num}
              </option>
            ))}
          </select>

          {/* FLAG */}
          <input
            type="text"
            placeholder="Digite a flag (ex: REDHACK{...})"
            className="w-full mb-4 p-3 rounded bg-black border border-white/20"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
          />

          {/* BOTÃO */}
          <button
            onClick={handleSubmit}
            className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-semibold transition"
          >
            Enviar Flag
          </button>

          {/* MENSAGEM */}
          {msg && (
            <p className="mt-4 text-center text-sm text-zinc-400">
              {msg}
            </p>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-6 text-center text-zinc-500 text-sm">
        © 2026 RED HACK CTF
      </footer>
    </div>
  );
}