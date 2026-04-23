"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type ImportCsvCardProps = {
  preview?: {
    usersCount: number;
    flagsCount: number;
    numeros: number[];
  } | null;
};

export function ImportCsvCard({ preview }: ImportCsvCardProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [usersCsv, setUsersCsv] = useState<File | null>(null);
  const [flagsCsv, setFlagsCsv] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleImport() {
    setError("");
    setMessage("");

    if (!usersCsv || !flagsCsv) {
      setError("Selecione os dois arquivos CSV antes de importar.");
      return;
    }

    const formData = new FormData();
    formData.append("usersCsv", usersCsv);
    formData.append("flagsCsv", flagsCsv);

    const response = await fetch("/api/admin/import-csv", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as { message?: string; error?: string };

    if (!response.ok) {
      setError(payload.error || "Falha ao importar os arquivos CSV.");
      return;
    }

    setMessage(payload.message || "Importação concluída.");
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <section className="rounded-[28px] border border-white/10 bg-zinc-900/75 p-6 text-zinc-100">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Carga administrativa</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Importar usuários e flags dos CSVs</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
            Envie os arquivos CSV pela interface. O import mantém o usuário `admin`, recria usuários e flags dos arquivos e atualiza o catálogo automaticamente.
          </p>
        </div>

        <button
          type="button"
          onClick={handleImport}
          disabled={isPending}
          className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-red-200 disabled:opacity-60"
        >
          {isPending ? "Importando..." : "Importar agora"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2 rounded-2xl border border-white/10 bg-black/60 p-4">
          <span className="text-sm font-semibold text-white">CSV de usuários</span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => setUsersCsv(event.target.files?.[0] ?? null)}
            className="rounded-xl border border-white/15 bg-black px-3 py-2 text-sm text-zinc-300"
          />
          <p className="text-xs text-zinc-400">Colunas obrigatórias: id, login, senha_hash. Opcional: nome</p>
        </label>

        <label className="grid gap-2 rounded-2xl border border-white/10 bg-black/60 p-4">
          <span className="text-sm font-semibold text-white">CSV de flags</span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => setFlagsCsv(event.target.files?.[0] ?? null)}
            className="rounded-xl border border-white/15 bg-black px-3 py-2 text-sm text-zinc-300"
          />
          <p className="text-xs text-zinc-400">Colunas obrigatórias: id, numero, user_id, value</p>
        </label>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Usuários</p>
          <p className="mt-2 text-3xl font-semibold text-white">{preview?.usersCount ?? "-"}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Flags</p>
          <p className="mt-2 text-3xl font-semibold text-white">{preview?.flagsCount ?? "-"}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Números</p>
          <p className="mt-2 text-base font-semibold text-white">{preview?.numeros?.join(", ") || "-"}</p>
        </div>
      </div>

      {message ? <p className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</p> : null}
      {error ? <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
    </section>
  );
}