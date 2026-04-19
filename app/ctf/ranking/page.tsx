import Image from "next/image";

import { CompetitionCountdown } from "@/components/ctf/CompetitionCountdown";
import { getCompetitionStatus, getRankingData } from "@/lib/ctf-data";

function renderCellLabel(resolvida: boolean, tentativasErradas: number) {
  if (resolvida) {
    return tentativasErradas > 0 ? `+${tentativasErradas}` : "+";
  }

  return tentativasErradas > 0 ? `-${tentativasErradas}` : "·";
}

export default async function RankingPage() {
  const [ranking, competitionStatus] = await Promise.all([
    getRankingData(),
    getCompetitionStatus(),
  ]);
  const flags = ranking[0]?.flags ?? [];

  return (
    <div className="grid gap-6">
      <section className="rounded-[32px] border border-white/10 bg-zinc-900/70 p-6 shadow-[0_28px_80px_rgba(8,15,32,0.5)] md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Scoreboard</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Ranking</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
              A classificação prioriza pontuação total, quantidade de flags resolvidas, menor número de tentativas erradas e, por fim, a última resolução registrada.
            </p>

            <div className="mt-5">
              <CompetitionCountdown
                endsAt={competitionStatus.endsAt}
                isRunning={competitionStatus.isRunning}
                finishedAt={competitionStatus.finishedAt}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-[28px] border border-amber-300/25 bg-amber-300/10 px-5 py-4 text-amber-50">
            <Image src="/master.png" alt="Master" width={56} height={56} className="h-14 w-14 rounded-2xl object-contain" />
            {/* <div>
              <p className="text-xs uppercase tracking-[0.25em] text-amber-100/70">Master</p>
              <p className="text-lg font-semibold">Líder da rodada</p>
            </div> */}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-zinc-100">
            <thead>
              <tr className="bg-black/80 text-xs uppercase tracking-[0.28em] text-zinc-400">
                <th className="px-4 py-4">#</th>
                <th className="px-4 py-4">Competidor</th>
                <th className="px-4 py-4">Score</th>
                <th className="px-4 py-4">Flags</th>
                <th className="px-4 py-4">Tentativas</th>
                {flags.map((flag) => (
                  <th key={flag.numero} className="px-4 py-4 text-center">
                    F{flag.numero}
                    <span className="ml-2 text-[10px] text-red-200/70">{flag.pontos}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ranking.map((entry, index) => (
                <tr key={entry.userId} className="border-t border-white/5 bg-zinc-900/45 odd:bg-zinc-900/70">
                  <td className="px-4 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-white">{index + 1}</span>
                      {index === 0 ? (
                        <Image src="/master.png" alt="Master" width={28} height={28} className="h-7 w-7 rounded-lg object-contain" />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <p className="font-semibold text-white">{entry.nome}</p>
                    <p className="text-xs text-zinc-400">@{entry.login}</p>
                  </td>
                  <td className="px-4 py-4 align-middle text-lg font-semibold text-red-100">{entry.score}</td>
                  <td className="px-4 py-4 align-middle">{entry.solvedCount}</td>
                  <td className="px-4 py-4 align-middle text-zinc-300">
                    {entry.totalAttempts} total / {entry.totalWrongAttempts} erradas
                  </td>
                  {entry.flags.map((flag) => (
                    <td key={`${entry.userId}-${flag.numero}`} className="px-4 py-4 text-center align-middle">
                      <div
                        className={[
                          "mx-auto flex h-11 w-14 items-center justify-center rounded-2xl border text-sm font-semibold",
                          flag.resolvida
                            ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
                            : flag.tentativasErradas > 0
                              ? "border-amber-400/30 bg-amber-500/15 text-amber-100"
                              : "border-white/10 bg-black/50 text-zinc-500",
                        ].join(" ")}
                        title={flag.resolvidaEm ? new Date(flag.resolvidaEm).toLocaleString("pt-BR") : "Sem resolução"}
                      >
                        {renderCellLabel(flag.resolvida, flag.tentativasErradas)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}