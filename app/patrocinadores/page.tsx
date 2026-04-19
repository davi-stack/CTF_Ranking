import { TopNav } from "@/components/TopNav";
import Image from "next/image";

export default function PatrocinadoresPage() {
  const sponsors = [{ img: "/aimirim.svg", name: "Aimirim" }];
  const supporters = [
    { img: "/brain2.png", name: "Brain" },
    { img: "/algar-log.png", name: "Algar" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">

      <TopNav />

      <section className="text-center py-20 px-6">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-red-300/80">Alliance Network</p>
        <h2 className="text-5xl font-bold text-red-500 mb-4">
          Patrocinadores
        </h2>
        <p className="text-zinc-300 max-w-2xl mx-auto">
          Empresas que tornam o RED HACK possível. Apoio essencial para inovação, tecnologia e segurança.
        </p>
      </section>

      <section id="master" className="py-10 px-6">
        <h3 className="text-center text-2xl font-bold text-zinc-100 mb-10">
          Master Sponsor: Exactti
        </h3>

        <div className="flex justify-center">
          <div className="relative w-full max-w-3xl rounded-3xl border border-red-500/45 bg-gradient-to-b from-zinc-900/95 to-black p-10 shadow-[0_0_60px_rgba(239,68,68,0.2)]">
            <div className="absolute inset-0 rounded-3xl bg-red-500/8 blur-2xl" />

            <div className="relative flex flex-col items-center">
              <Image
                src="/master.png"
                alt="Exactti"
                width={280}
                height={128}
                className="transition duration-300 hover:scale-105"
              />
              <p className="mt-6 text-center text-zinc-300">
                Parceiro principal do RED HACK CTF e referência no ecossistema de inovação.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="sponsors" className="py-16 px-6">
        <h3 className="mb-10 text-center text-2xl font-bold text-zinc-100">Sponsor</h3>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="rounded-2xl border border-red-500/30 bg-zinc-900/80 p-8 transition hover:border-red-400"
            >
              <div className="flex flex-col items-center gap-5 text-center">
                <Image
                  src={sponsor.img}
                  alt={sponsor.name}
                  width={220}
                  height={88}
                  className="h-20 w-auto object-contain"
                />
                <p className="text-zinc-300">{sponsor.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="apoio" className="pb-20 px-6">
        <h3 className="mb-10 text-center text-2xl font-bold text-zinc-100">Apoio</h3>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {supporters.map((supporter) => (
            <div
              key={supporter.name}
              className="rounded-2xl border border-white/10 bg-zinc-900/70 p-7 transition hover:border-red-500/40"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <Image
                  src={supporter.img}
                  alt={supporter.name}
                  width={180}
                  height={78}
                  className="h-16 w-auto object-contain"
                />
                <p className="text-sm text-zinc-300">{supporter.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-auto border-t border-red-500/20 py-6 text-center text-zinc-500 text-sm">
        © 2026 RED HACK CTF • Sponsors
      </footer>
    </div>
  );
}