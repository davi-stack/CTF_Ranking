"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleLogout() {
    setError("");

    const response = await fetch("/api/logout", {
      method: "POST",
    });

    if (!response.ok) {
      setError("Falha ao encerrar a sessão.");
      return;
    }

    startTransition(() => {
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3">
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-rose-400 hover:bg-rose-500/10 disabled:opacity-60"
      >
        {isPending ? "Saindo..." : "Sair"}
      </button>
    </div>
  );
}