import type { ReactNode } from "react";

import { ProtectedNav } from "@/components/ProtectedNav";
import { requireSessionUser } from "@/lib/auth";

export default async function CtfLayout({ children }: { children: ReactNode }) {
  const user = await requireSessionUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(153,27,27,0.18),_transparent_26%),linear-gradient(180deg,_#050505,_#0d0707_48%,_#040404)] text-white">
      <ProtectedNav user={user} />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">{children}</main>
    </div>
  );
}