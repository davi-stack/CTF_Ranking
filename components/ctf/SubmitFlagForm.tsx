"use client";

import { useMemo, useState } from "react";

type SubmitFlagOption = {
  numero: number;
  titulo: string;
  descricao: string;
  pontos: number;
  ativa: boolean;
  resolvida: boolean;
};

type SubmitFlagFormProps = {
  flags: SubmitFlagOption[];
};

type SubmitResponse = {
  correta?: boolean;
  error?: string;
};

export function SubmitFlagForm({ flags }: SubmitFlagFormProps) {
  const [selectedNumber, setSelectedNumber] = useState(flags[0]?.numero ?? 1);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedFlag = useMemo(
    () => flags.find((flag) => flag.numero === selectedNumber) ?? flags[0],
    [flags, selectedNumber]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/submit-flag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numero: selectedNumber,
          value,
        }),
      });

      const data = (await response.json()) as SubmitResponse;

      if (!response.ok) {
        setError(data.error || "Falha ao enviar a flag.");
        return;
      }

      setResult(data.correta ? "Flag correta. Pontuação registrada no ranking." : "Flag incorreta. Revise e tente novamente.");
      setValue("");
    } catch {
      setError("Falha de comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-white/10 bg-zinc-900/75 p-6 shadow-[0_24px_80px_rgba(10,14,28,0.45)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Submissão segura</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Enviar flag</h1>
          </div>
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-50">
            Anti brute-force ativo
          </div>
        </div>

        <div className="mt-8 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-zinc-200">Desafio</span>
            <select
              value={selectedNumber}
              onChange={(event) => setSelectedNumber(Number(event.target.value))}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500"
            >
              {flags.map((flag) => (
                <option key={flag.numero} value={flag.numero}>
                  {flag.titulo} · {flag.pontos} pts
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-zinc-200">Valor da flag</span>
            <input
              type="text"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Ex.: REDHACK{...}"
              autoComplete="off"
              spellCheck={false}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500"
              required
            />
          </label>

          {error ? <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
          {result ? <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{result}</p> : null}

          <button
            type="submit"
            disabled={loading || !selectedFlag?.ativa}
            className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Validando..." : "Submeter"}
          </button>
        </div>
      </form>

      <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-zinc-100">
        <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Contexto do desafio</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{selectedFlag?.titulo}</h2>
        <p className="mt-4 text-sm leading-7 text-zinc-300">{selectedFlag?.descricao}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Pontuação</p>
            <p className="mt-2 text-2xl font-semibold text-white">{selectedFlag?.pontos} pts</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Status</p>
            <p className="mt-2 text-sm font-semibold text-white">
              {selectedFlag?.resolvida ? "Já resolvida" : selectedFlag?.ativa ? "Disponível" : "Desativada"}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}