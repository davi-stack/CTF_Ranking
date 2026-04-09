import { TopNav } from "@/components/TopNav";
import Image from "next/image";
import Link from "next/link";
export default function PatrocinadoresPage() {
    const sponsors = [
        { img: "/algar-log.png", name: "Algar Telecom" },
        { img: "/aimirim.svg", name: "Aimirim", master: true },
        { img: "/brain2.png", name: "Brain" },
      ];
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">

      {/* 🔴 NAVBAR */}
      <TopNav/>

      {/* 🔥 HERO */}
      <section className="text-center py-20 px-6">
        <h2 className="text-5xl font-bold text-red-500 mb-4">
          Patrocinadores
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Empresas que tornam o RED HACK possível. Apoio essencial para inovação, tecnologia e segurança.
        </p>
      </section>

      {/* 👑 MASTER SPONSOR */}
      <section id="master" className="py-10 px-6">
        <h3 className="text-center text-2xl font-bold text-zinc-300 mb-10">
          👑 Master Sponsor
        </h3>

        <div className="flex justify-center">
          <div className="relative bg-gradient-to-b from-zinc-900 to-black border border-red-600/40 rounded-2xl p-10 w-full max-w-3xl flex flex-col items-center shadow-lg">

            {/* glow */}
            <div className="absolute inset-0 bg-red-500/10 blur-2xl rounded-2xl" />

            <Image
              src="/master.png"
              alt="Master Sponsor"
              width={260}
              height={120}
              className="relative hover:scale-110 transition"
            />

            {/* <p className="mt-6 text-zinc-400 text-center">
              Patrocinador principal do evento RED HACK CTF
            </p> */}
          </div>
        </div>
      </section>

      {/* 🧩 SPONSORS */}
<section id="sponsors" className="py-20 px-6">
  <h3 className="text-center text-2xl font-bold text-zinc-300 mb-10">
    Sponsors
  </h3>

  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

    {sponsors.map((s, i) => (
      <div
        key={i}
        className="
          bg-zinc-900 border border-white/10 rounded-xl p-8 
          flex flex-col items-center justify-center gap-4 transition
          hover:border-red-500
        "
      >
        <Image
          src={s.img}
          alt={s.name}
          width={s.master ? 182 : 140}   // ✅ 30% maior (140 * 1.3 = 182)
          height={s.master ? 78 : 60}
          className={`
            transition
            ${s.master ? "" : "grayscale hover:grayscale-0"}
          `}
        />

        <p className="text-zinc-400 text-sm">
          {s.name}
        </p>
      </div>
    ))}

  </div>
</section>

      {/* ⚫ FOOTER */}
      <footer className="mt-auto border-t border-white/10 py-6 text-center text-zinc-500 text-sm">
        © 2026 RED HACK CTF • Sponsors
      </footer>

    </div>
  );
}