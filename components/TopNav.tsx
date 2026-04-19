import Image from "next/image";
import Link from "next/link";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="RED HACK Logo"
            width={116}
            height={42}
            priority
            className="h-10 w-auto"
          />
          <div>
            {/* <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Brain</p> */}
            <p className="text-sm font-semibold text-white">Red Hack CTF</p>
          </div>
        </Link>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <nav className="flex flex-wrap gap-2 text-sm font-medium text-zinc-200">
            <Link className="rounded-full px-4 py-2 transition hover:bg-white/8" href="/#sobre">
              Sobre
            </Link>
            <Link className="rounded-full px-4 py-2 transition hover:bg-white/8" href="/#programacao">
              Programação
            </Link>
            <Link className="rounded-full px-4 py-2 transition hover:bg-white/8" href="/#contato">
              Contato
            </Link>
            <Link className="rounded-full px-4 py-2 transition hover:bg-white/8" href="/patrocinadores">
              Patrocinadores
            </Link>
          </nav>

          <Link
            href="/login"
            className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-red-200"
          >
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
}