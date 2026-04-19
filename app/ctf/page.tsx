import Link from "next/link";

import { getCompetitorDashboard } from "@/lib/ctf-data";
import { requireSessionUser } from "@/lib/auth";

export default async function CtfDashboardPage() {
  const user = await requireSessionUser();
  const dashboard = await getCompetitorDashboard(user);

  return (
    <div className="grid gap-6">
      <section className="rounded-[32px] border border-white/10 bg-zinc-900/70 p-6 shadow-[0_28px_80px_rgba(8,15,32,0.5)] md:p-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Visão do competidor</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Desafios, descrições e progresso em um só lugar</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
              Consulte a descrição de cada flag, acompanhe o que já foi resolvido, submeta novos valores e acompanhe sua posição no ranking sem precisar navegar por telas desconectadas.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/ctf/submit"
              className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-red-200"
            >
              Submeter flag
            </Link>
            <Link
              href="/ctf/ranking"
              className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-red-500/50 hover:bg-red-500/10"
            >
              Ver ranking
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-black/60 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Pontuação</p>
            <p className="mt-3 text-4xl font-semibold text-white">{dashboard.totalScore}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-black/60 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Flags resolvidas</p>
            <p className="mt-3 text-4xl font-semibold text-white">{dashboard.solvedCount}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-black/60 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Submissões</p>
            <p className="mt-3 text-4xl font-semibold text-white">{dashboard.totalAttempts}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-black/60 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Última resolução</p>
            <p className="mt-3 text-sm font-semibold text-white">
              {dashboard.lastSolvedAt ? new Date(dashboard.lastSolvedAt).toLocaleString("pt-BR") : "Nenhuma ainda"}
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {dashboard.flags.map((flag) => (
          <article
            key={flag.numero}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-red-500/30 hover:bg-white/[0.07]"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Flag {flag.numero}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{flag.titulo}</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-300">{flag.descricao}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Pontos</p>
                <p className="mt-2 text-2xl font-semibold text-white">{flag.pontos}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className={[
                "rounded-full px-3 py-1",
                flag.resolvida ? "bg-emerald-500/15 text-emerald-100" : "bg-amber-500/15 text-amber-100",
              ].join(" ")}>
                {flag.resolvida ? "Resolvida" : "Pendente"}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-zinc-200">
                Tentativas: {flag.tentativasTotais}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-zinc-200">
                Erradas: {flag.tentativasErradas}
              </span>
              {!flag.ativa ? <span className="rounded-full bg-rose-500/15 px-3 py-1 text-rose-100">Desativada</span> : null}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
              <p className="text-sm text-zinc-400">
                {flag.ultimaSubmissaoEm ? `Última submissão em ${new Date(flag.ultimaSubmissaoEm).toLocaleString("pt-BR")}` : "Ainda não houve submissão para esta flag."}
              </p>

              <Link
                href="/ctf/submit"
                className="rounded-xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/10"
              >
                Ir para submissão
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}