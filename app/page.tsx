import { TopNav } from "@/components/TopNav";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      {/* 🔴 NAVBAR */}
      <TopNav/>

      {/* 🔥 HERO */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <p className="mb-3 text-xs uppercase tracking-[0.42em] text-red-300/80">Neon Breach Protocol</p>
        <h2 className="text-5xl font-bold text-primary mb-4 md:text-6xl">
          RED HACK CTF
        </h2>
        <p className="max-w-xl text-lg text-zinc-300 mb-8">
          Only those who think outside the box will proceed.
        </p>

        <a
          href="https://forms.gle/tLomdomFXAenhoLw9"
          className="rounded-lg border border-red-400/40 bg-red-500 px-6 py-3 font-semibold text-black transition hover:bg-red-400"
        >
          Inscreva-se
        </a>
      </section>

      {/* 🧠 SOBRE */}
      <section id="sobre" className="flex flex-col items-center justify-center text-center py-24 px-6">
        <h3 className="text-3xl font-bold text-primary mb-6">
          O que é CTF?
        </h3>
        <p className="text-zinc-300 leading-relaxed">
          Capture The Flag (CTF) é uma competição prática de segurança da informação
          onde participantes resolvem desafios de criptografia, web, engenharia reversa
          e forense. O objetivo é encontrar flags escondidas explorando vulnerabilidades
          e aplicando conhecimento técnico e criatividade.
        </p>
      </section>

      {/* 📅 PROGRAMAÇÃO */}
      <section id="programacao" className="bg-black/65 py-20 px-6">
  <div className="max-w-5xl mx-auto">
    
    <h3 className="text-3xl font-bold text-primary mb-10 text-center">
      Programação
    </h3>

    <div className="space-y-4">

      {[
        { time: "09:00", title: "Abertura", icon: "🕘" },
        { time: "09:30", title: "Apresentações e treinamentos", icon: "🎤" },
        { time: "12:00", title: "Intervalo", icon: "🍽️" },
        { time: "13:30", title: "Início dos desafios", icon: "💻" },
        { time: "16:30", title: "Intervalo", icon: "☕" },
        { time: "17:30", title: "Encerramento", icon: "🏁" },
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-4 bg-zinc-900 border border-white/10 rounded-xl p-4 hover:border-red-500 transition"
        >
          
          {/* Ícone */}
          <div className="text-2xl">
            {item.icon}
          </div>

          {/* Horário */}
          <div className="text-red-500 font-bold w-20">
            {item.time}
          </div>

          {/* Descrição */}
          <div className="text-zinc-300">
            {item.title}
          </div>

        </div>
      ))}

    </div>
  </div>
</section>

      {/* 📚 PREPARAÇÃO */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h3 className="text-3xl font-bold text-primary mb-6">
          Quer se preparar?
        </h3>
        <p className="text-zinc-300 mb-6">
          Recomendamos o curso introdutório de Pentest da Desec:
        </p>

        <a
  href="https://desecsecurity.com/curso/introducao-pentest"
  target="_blank"
  className="border border-red-500 text-red-500 px-6 py-3 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300"
>
  Acessar Curso
</a>
      </section>

      {/* 📩 CONTATO */}
      <section
  id="contato"
  className="flex flex-col items-center justify-center text-center py-24 px-6"
>
  <div className="max-w-5xl mx-auto text-center">
    <h3 className="text-3xl font-bold text-white mb-6">
      Contato
    </h3>

    <p className="text-zinc-300">
      Dúvidas? Entre em contato pelo e-mail:
    </p>

    <p className="text-red-500 mt-2 font-semibold">
      redhackeventos@gmail.com
    </p>
  </div>
</section>

      {/* ⚫ FOOTER */}
      <footer className="mt-auto border-t border-red-500/20 py-6 text-center text-zinc-500 text-sm">
        © 2026 RED HACK CTF • Brain / Algar Telecom
      </footer>
    </div>
  );
}