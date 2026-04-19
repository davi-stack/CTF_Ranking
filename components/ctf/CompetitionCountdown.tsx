"use client";

import { useEffect, useMemo, useState } from "react";

type CompetitionCountdownProps = {
  endsAt: string | null;
  isRunning: boolean;
  finishedAt: string | null;
};

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function CompetitionCountdown({ endsAt, isRunning, finishedAt }: CompetitionCountdownProps) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!isRunning || !endsAt) {
      return;
    }

    const initialTick = setTimeout(() => {
      setNow(Date.now());
    }, 0);

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearTimeout(initialTick);
      clearInterval(timer);
    };
  }, [isRunning, endsAt]);

  const content = useMemo(() => {
    if (!endsAt) {
      return {
        label: "Competição não iniciada",
        value: "Aguardando início",
        tone: "bg-zinc-700/40 text-zinc-100 border-zinc-500/30",
      };
    }

    if (!isRunning) {
      return {
        label: "Competição encerrada",
        value: finishedAt ? `Finalizada em ${new Date(finishedAt).toLocaleString("pt-BR")}` : "Encerrada",
        tone: "bg-rose-500/15 text-rose-100 border-rose-400/30",
      };
    }

    const remaining = new Date(endsAt).getTime() - now;
    return {
      label: "Tempo restante",
      value: formatRemaining(remaining),
      tone: "bg-emerald-500/15 text-emerald-100 border-emerald-400/30",
    };
  }, [endsAt, finishedAt, isRunning, now]);

  return (
    <div className={["rounded-2xl border px-4 py-3", content.tone].join(" ")}>
      <p className="text-xs uppercase tracking-[0.2em]">{content.label}</p>
      <p className="mt-1 text-lg font-semibold">{content.value}</p>
    </div>
  );
}
