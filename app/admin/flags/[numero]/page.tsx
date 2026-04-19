import Link from "next/link";

import { FlagAdminClient } from "@/components/admin/FlagAdminClient";
import { ProtectedNav } from "@/components/ProtectedNav";
import { requireAdminUser } from "@/lib/auth";
import { getAdminFlagDetail } from "@/lib/ctf-data";

type AdminFlagPageProps = {
  params: Promise<{
    numero: string;
  }>;
};

export default async function AdminFlagPage({ params }: AdminFlagPageProps) {
  const admin = await requireAdminUser();
  const { numero } = await params;
  const numericFlag = Number(numero);
  const data = await getAdminFlagDetail(numericFlag);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(153,27,27,0.2),_transparent_26%),linear-gradient(180deg,_#050505,_#0d0707_48%,_#040404)] text-white">
      <ProtectedNav user={admin} />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-6">
        <section className="rounded-[32px] border border-white/10 bg-zinc-900/70 p-6 shadow-[0_28px_80px_rgba(8,15,32,0.5)] md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Administração por flag</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">
                {data.flag ? data.flag.titulo : `Flag ${numericFlag}`}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
                Use esta página para definir a pontuação global, ajustar a descrição pública e manter observações internas de cada competidor.
              </p>
            </div>

            <Link
              href="/admin"
              className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-red-500/50 hover:bg-red-500/10"
            >
              Voltar ao admin
            </Link>
          </div>
        </section>

        {data.flag ? (
          <FlagAdminClient flag={data.flag} users={data.users} />
        ) : (
          <section className="rounded-[28px] border border-rose-500/30 bg-rose-500/10 p-6 text-rose-100">
            A flag solicitada não existe no catálogo. Importe os CSVs ou crie a configuração pelo script de bootstrap.
          </section>
        )}
      </main>
    </div>
  );
}