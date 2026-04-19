"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function validate() {
      try {
        const res = await fetch("/api/me");

        // ❌ token inválido ou não autenticado
        if (res.status !== 200) {
          router.push("/login");
          return;
        }

        // ✅ autorizado
        setAuthorized(true);

      } catch {
        router.push("/login");
      }
    }

    validate();
  }, [router]);

  // ⏳ evita flicker
  if (!authorized) return null;

  return <>{children}</>;
}
