"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { AdminFlagDetailRow, FlagCatalogRow } from "@/lib/types";

type FlagAdminClientProps = {
  flag: FlagCatalogRow;
  users: AdminFlagDetailRow[];
};

export function FlagAdminClient({ flag, users }: FlagAdminClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState(flag.titulo);
  const [description, setDescription] = useState(flag.descricao);
  const [points, setPoints] = useState(flag.pontos);
  const [active, setActive] = useState(flag.ativa);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(users.map((user) => [user.userId, user.observacao]))
  );
  const [isSavingMeta, startMetaTransition] = useTransition();
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  async function handleSaveMetadata(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const response = await fetch(`/api/admin/flags/${flag.numero}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: title,
        descricao: description,
        pontos: Number(points),
        ativa: active,
      }),
    });

    const payload = (await response.json()) as { message?: string; error?: string };

    if (!response.ok) {
      setError(payload.error || "Falha ao atualizar a flag.");
      return;
    }

    startMetaTransition(() => {
      setMessage(payload.message || "Metadados atualizados.");
      router.refresh();
    });
  }

  async function saveObservation(userId: string) {
    setSavingUserId(userId);
    setMessage("");
    setError("");

    const response = await fetch("/api/admin/observations", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        numero: flag.numero,
        observacao: notes[userId] ?? "",
      }),
    });

    const payload = (await response.json()) as { message?: string; error?: string };

    setSavingUserId(null);

    if (!response.ok) {
      setError(payload.error || "Falha ao salvar observação.");
      return;
    }

    setMessage(payload.message || "Observação salva.");
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <form
        onSubmit={handleSaveMetadata}
        className="rounded-[28px] border border-white/10 bg-zinc-900/75 p-6"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Configuração global</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Flag {flag.numero}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
              Este bloco controla a descrição, pontuação e disponibilidade da flag para todos os competidores.
            </p>
          </div>
          <button
            type="submit"
            disabled={isSavingMeta}
            className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-red-200 disabled:opacity-60"
          >
            {isSavingMeta ? "Salvando..." : "Salvar configuração"}
          </button>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-zinc-200">Título</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-zinc-200">Pontuação</span>
            <input
              type="number"
              min={1}
              value={points}
              onChange={(event) => setPoints(Number(event.target.value))}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
          </label>
          <label className="grid gap-2 lg:col-span-2">
            <span className="text-sm font-medium text-zinc-200">Descrição</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500"
            />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black px-4 py-3 text-white lg:col-span-2">
            <input
              type="checkbox"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
              className="h-4 w-4"
            />
            Flag disponível para submissão
          </label>
        </div>

        {message ? <p className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</p> : null}
        {error ? <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
      </form>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Acompanhamento</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Situação por competidor</h3>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/60 px-4 py-2 text-sm text-zinc-300">
            {users.filter((item) => item.resolvida).length} / {users.length} resolveram
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-zinc-200">
            <thead>
              <tr className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                <th className="px-3">Competidor</th>
                <th className="px-3">Status</th>
                <th className="px-3">Tentativas</th>
                <th className="px-3">Última</th>
                <th className="px-3">Observação</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId} className="rounded-2xl bg-zinc-900/70 align-top">
                  <td className="rounded-l-2xl px-3 py-4">
                    <p className="font-semibold text-white">{user.nome}</p>
                    <p className="text-xs text-zinc-400">@{user.login}</p>
                  </td>
                  <td className="px-3 py-4">
                    <span className={[
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      user.resolvida ? "bg-emerald-500/15 text-emerald-100" : "bg-amber-500/15 text-amber-100",
                    ].join(" ")}>
                      {user.resolvida ? "Resolvida" : "Pendente"}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-zinc-300">
                    {user.tentativasTotais} total / {user.tentativasErradas} erradas
                  </td>
                  <td className="px-3 py-4 text-zinc-300">{user.ultimaSubmissaoEm ? new Date(user.ultimaSubmissaoEm).toLocaleString("pt-BR") : "Sem envio"}</td>
                  <td className="rounded-r-2xl px-3 py-4">
                    <div className="grid gap-3">
                      <textarea
                        value={notes[user.userId] ?? ""}
                        onChange={(event) =>
                          setNotes((current) => ({
                            ...current,
                            [user.userId]: event.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => saveObservation(user.userId)}
                        disabled={savingUserId === user.userId}
                        className="justify-self-start rounded-xl border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-500/10 disabled:opacity-60"
                      >
                        {savingUserId === user.userId ? "Salvando..." : "Salvar observação"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}