"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/ctf");
        return;
      }

      setError(data.error || "Login inválido");
    } catch {
      setError("Falha na conexão");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(153,27,27,0.2),_transparent_28%),linear-gradient(180deg,_#050505,_#0d0707_48%,_#040404)] px-4 py-12 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="rounded-[36px] border border-white/10 bg-zinc-900/60 p-8 shadow-[0_28px_80px_rgba(8,15,32,0.5)] md:p-10">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Red Hack" width={112} height={42} className="h-11 w-auto" priority />
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-red-200/70">Brain</p>
              <p className="text-sm font-semibold text-white">Painel do competidor</p>
            </div>
          </div>

          <h1 className="mt-8 text-5xl font-semibold leading-tight text-white">
            Entre para acessar desafios, submissões e ranking.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-300">
            A sessão usa cookie `httpOnly`, proteção de origem e limitação de tentativas para reduzir brute-force e evitar exposição de token no navegador.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Fluxo</p>
              <p className="mt-2 text-sm font-semibold text-white">Desafios, submissão e ranking</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Segurança</p>
              <p className="mt-2 text-sm font-semibold text-white">Rate limit e sessão isolada</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Admin</p>
              <p className="mt-2 text-sm font-semibold text-white">Usuário `admin` com painel próprio</p>
            </div>
          </div>

          <Link href="/" className="mt-8 inline-flex rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-red-500/50 hover:bg-red-500/10">
            Voltar para a página inicial
          </Link>
        </section>

        <form
          onSubmit={handleLogin}
          className="rounded-[32px] border border-white/10 bg-zinc-900/75 p-8 shadow-[0_28px_80px_rgba(8,15,32,0.5)]"
        >
          <p className="text-xs uppercase tracking-[0.32em] text-red-200/70">Autenticação</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Login</h2>

          <div className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-zinc-200">Login</span>
              <input
                className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin ou user1"
                autoComplete="username"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-zinc-200">Senha</span>
              <input
                type="password"
                className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
              />
            </label>

            {error ? <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-red-200 disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}