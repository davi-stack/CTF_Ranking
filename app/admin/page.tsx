import Link from "next/link";

import { CompetitionControlCard } from "@/components/admin/CompetitionControlCard";
import { ImportCsvCard } from "@/components/admin/ImportCsvCard";
import { ProtectedNav } from "@/components/ProtectedNav";
import { requireAdminUser } from "@/lib/auth";
import { getAdminOverview, getCompetitionStatus } from "@/lib/ctf-data";

export default async function AdminPage() {
  const admin = await requireAdminUser();
  const [overview, competitionStatus] = await Promise.all([
    getAdminOverview(),
    getCompetitionStatus(),
  ]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(153,27,27,0.2),_transparent_26%),linear-gradient(180deg,_#050505,_#0d0707_48%,_#040404)] text-white">
      <ProtectedNav user={admin} />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-6">
        <section className="rounded-[32px] border border-white/10 bg-zinc-900/70 p-6 shadow-[0_28px_80px_rgba(8,15,32,0.5)] md:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Centro administrativo</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Gestão de usuários, flags e observações</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            Aqui você importa os CSVs, altera a pontuação global de cada flag, acompanha o progresso dos competidores e registra observações operacionais por desafio.
          </p>
        </section>

        <CompetitionControlCard initialStatus={competitionStatus} />

        <ImportCsvCard preview={null} />

        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Flags</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Catálogo global</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {overview.catalog.map((flag) => (
              <article key={flag.numero} className="rounded-[26px] border border-white/10 bg-black/60 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-red-200/70">Flag {flag.numero}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{flag.titulo}</h3>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-200">{flag.pontos} pts</span>
                </div>
                <p className="mt-4 line-clamp-4 text-sm leading-7 text-zinc-300">{flag.descricao}</p>
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                  <span className={[
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    flag.ativa ? "bg-emerald-500/15 text-emerald-100" : "bg-rose-500/15 text-rose-100",
                  ].join(" ")}>
                    {flag.ativa ? "Ativa" : "Desativada"}
                  </span>
                  <Link
                    href={`/admin/flags/${flag.numero}`}
                    className="rounded-xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/10"
                  >
                    Abrir detalhe
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Competidores</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Visão resumida</h2>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-zinc-200">
              <thead>
                <tr className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  <th className="px-3">Competidor</th>
                  <th className="px-3">Score</th>
                  <th className="px-3">Flags resolvidas</th>
                  <th className="px-3">Status por flag</th>
                </tr>
              </thead>
              <tbody>
                {overview.users.map((user) => (
                  <tr key={user.id} className="rounded-2xl bg-zinc-900/70 align-top">
                    <td className="rounded-l-2xl px-3 py-4">
                      <p className="font-semibold text-white">{user.nome}</p>
                      <p className="text-xs text-zinc-400">@{user.login}</p>
                    </td>
                    <td className="px-3 py-4 text-lg font-semibold text-red-100">{user.score}</td>
                    <td className="px-3 py-4">{user.solvedCount}</td>
                    <td className="rounded-r-2xl px-3 py-4">
                      <div className="flex flex-wrap gap-2">
                        {user.flags.map((flag) => (
                          <Link
                            key={`${user.id}-${flag.numero}`}
                            href={`/admin/flags/${flag.numero}`}
                            className={[
                              "rounded-full px-3 py-1 text-xs font-semibold transition",
                              flag.resolvida
                                ? "bg-emerald-500/15 text-emerald-100"
                                : flag.tentativasErradas > 0
                                  ? "bg-amber-500/15 text-amber-100"
                                  : "bg-black/70 text-zinc-300",
                            ].join(" ")}
                          >
                            F{flag.numero} · {flag.resolvida ? "OK" : flag.tentativasTotais > 0 ? `${flag.tentativasTotais} envios` : "sem envio"}
                          </Link>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}