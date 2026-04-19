"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { CompetitionStatus } from "@/lib/types";

type CompetitionControlCardProps = {
  initialStatus: CompetitionStatus;
};

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("pt-BR");
}

export function CompetitionControlCard({ initialStatus }: CompetitionControlCardProps) {
  const router = useRouter();
  const [durationMinutes, setDurationMinutes] = useState(180);
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleStart() {
    setError("");
    setMessage("");

    const response = await fetch("/api/admin/competition", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ durationMinutes }),
    });

    const payload = (await response.json()) as {
      message?: string;
      error?: string;
      status?: CompetitionStatus;
    };

    if (!response.ok) {
      setError(payload.error || "Falha ao iniciar competição.");
      return;
    }

    setMessage(payload.message || "Competição iniciada.");
    if (payload.status) {
      setStatus(payload.status);
    }

    startTransition(() => {
      router.refresh();
    });
  }

  async function handleFinish() {
    setError("");
    setMessage("");

    const response = await fetch("/api/admin/competition", {
      method: "PATCH",
    });

    const payload = (await response.json()) as {
      message?: string;
      error?: string;
      status?: CompetitionStatus;
    };

    if (!response.ok) {
      setError(payload.error || "Falha ao finalizar competição.");
      return;
    }

    setMessage(payload.message || "Competição finalizada.");
    if (payload.status) {
      setStatus(payload.status);
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <section className="rounded-[28px] border border-white/10 bg-zinc-900/75 p-6 text-zinc-100">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Competição</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Controle de rodada</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Inicie uma nova competição com duração definida ou finalize a rodada atual a qualquer momento.
          </p>
        </div>
        <div className={["rounded-full px-4 py-2 text-sm font-semibold", status.isRunning ? "bg-emerald-500/20 text-emerald-100" : "bg-zinc-700/60 text-zinc-100"].join(" ")}>
          {status.isRunning ? "Em andamento" : status.hasOpenCompetition ? "Aguardando finalização" : "Parada"}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Início</p>
          <p className="mt-2 text-sm font-semibold text-white">{formatDate(status.startedAt)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Término previsto</p>
          <p className="mt-2 text-sm font-semibold text-white">{formatDate(status.endsAt)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Finalizada em</p>
          <p className="mt-2 text-sm font-semibold text-white">{formatDate(status.finishedAt)}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-200">Duração (minutos)</span>
          <input
            type="number"
            min={1}
            max={1440}
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(Number(event.target.value))}
            className="rounded-xl border border-white/15 bg-black px-4 py-2 text-white outline-none focus:border-red-500"
            disabled={status.hasOpenCompetition || isPending}
          />
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleStart}
            disabled={status.hasOpenCompetition || isPending}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-60"
          >
            Iniciar competição
          </button>
          <button
            type="button"
            onClick={handleFinish}
            disabled={!status.hasOpenCompetition || isPending}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-red-400 disabled:opacity-60"
          >
            Finalizar competição
          </button>
        </div>
      </div>

      {message ? <p className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</p> : null}
      {error ? <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
    </section>
  );
}
