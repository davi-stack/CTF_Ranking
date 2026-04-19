"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/LogoutButton";
import type { SessionUser } from "@/lib/types";

type ProtectedNavProps = {
  user: SessionUser;
};

const competitorLinks = [
  { href: "/ctf", label: "Desafios" },
  { href: "/ctf/submit", label: "Submeter" },
  { href: "/ctf/ranking", label: "Ranking" },
];

export function ProtectedNav({ user }: ProtectedNavProps) {
  const pathname = usePathname();
  const links = user.isAdmin
    ? [...competitorLinks, { href: "/admin", label: "Admin" }]
    : competitorLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/ctf" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Red Hack"
              width={104}
              height={40}
              priority
              className="h-9 w-auto"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-red-200/70">Brain CTF</p>
              <p className="text-sm font-semibold text-white">Painel operacional</p>
            </div>
          </Link>
          <div className="hidden rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1 text-xs text-red-100 md:block">
            {user.isAdmin ? "Administrador" : "Competidor"}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <nav className="flex flex-wrap gap-2">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-red-500 text-black"
                      : "border border-white/10 bg-white/5 text-zinc-100 hover:border-red-500/40 hover:bg-red-500/10",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <div>
              <p className="text-sm font-semibold text-white">{user.nome}</p>
              <p className="text-xs text-zinc-300">@{user.login}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}