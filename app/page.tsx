import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      {/* 🔴 NAVBAR */}
      <header className="w-full border-b border-white/10 bg-black/80 backdrop-blur">
  <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
    
    {/* LOGO + NOME */}
    <div className="flex items-center gap-3 group cursor-pointer">
      <Image
        src="/logo.png"
        alt="RED HACK Logo"
        width={110}
        height={40}
        priority
        className="transition-transform duration-300 group-hover:scale-105"
      />
      {/* <h1 className="text-2xl font-bold text-primary transition-all duration-300 group-hover:text-red-400">
        RED HACK
      </h1> */}
    </div>

    {/* NAV */}
    <nav className="flex gap-8 text-base font-medium">
      <a
        href="#sobre"
        className="relative transition-colors hover:text-primary"
      >
        Sobre
      </a>

      <a
        href="#programacao"
        className="relative transition-colors hover:text-primary"
      >
        Programação
      </a>

      <a
        href="#contato"
        className="relative transition-colors hover:text-primary"
      >
        Contato
      </a>
    </nav>
  </div>
</header>

      {/* 🔥 HERO */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <h2 className="text-5xl font-bold text-primary mb-4">
          RED HACK CTF
        </h2>
        <p className="max-w-xl text-lg text-zinc-400 mb-8">
          Only those who think outside the box will proceed.
        </p>

        <a
          href="https://forms.gle/tLomdomFXAenhoLw9"
          className="bg-primary hover:bg-red-700 transition px-6 py-3 rounded-lg font-semibold"
        >
          Inscreva-se
        </a>
      </section>

      {/* 🧠 SOBRE */}
      <section id="sobre" className="max-w-5xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-primary mb-6">
          O que é CTF?
        </h3>
        <p className="text-zinc-400 leading-relaxed">
          Capture The Flag (CTF) é uma competição prática de segurança da informação
          onde participantes resolvem desafios de criptografia, web, engenharia reversa
          e forense. O objetivo é encontrar flags escondidas explorando vulnerabilidades
          e aplicando conhecimento técnico e criatividade.
        </p>
      </section>

      {/* 📅 PROGRAMAÇÃO */}
      <section id="programacao" className="bg-black/60 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-primary mb-6">
            Programação
          </h3>

          <ul className="space-y-4 text-zinc-300">
            <li>🕘 09:00 - Abertura</li>
            <li>🚀 09:30 - Início dos desafios</li>
            <li>🍽️ 12:00 - Intervalo</li>
            <li>🏁 15:30 - Encerramento</li>
          </ul>
        </div>
      </section>

      {/* 📚 PREPARAÇÃO */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h3 className="text-3xl font-bold text-primary mb-6">
          Quer se preparar?
        </h3>
        <p className="text-zinc-400 mb-6">
          Recomendamos o curso introdutório de Pentest da Desec:
        </p>

        <a
          href="https://desecsecurity.com/curso/introducao-pentest"
          target="_blank"
          className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-black transition"
        >
          Acessar Curso
        </a>
      </section>

      {/* 📩 CONTATO */}
      <section id="contato" className="bg-black/80 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-primary mb-6">
            Contato
          </h3>

          <p className="text-zinc-400">
            Dúvidas? Entre em contato pelo e-mail:
          </p>

          <p className="text-primary mt-2">
          redhackeventos@gmail.com
          </p>
        </div>
      </section>

      {/* ⚫ FOOTER */}
      <footer className="mt-auto border-t border-white/10 py-6 text-center text-zinc-500 text-sm">
        © 2026 RED HACK CTF • Brain / Algar Telecom
      </footer>
    </div>
  );
}