import Image from "next/image"
import Link from "next/link"
export function TopNav(){
    return (
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
            <h1 className="text-2xl hidden md:block font-bold text-primary py-2">
              RED HACK
            </h1>
          </div>

          {/* NAV */}
          <nav className="flex gap-8 text-base font-medium">
          <Link href="/#sobre">Sobre</Link>
            <Link href="/#programacao">Programação</Link>
            <Link href="/#contato">Contato</Link>
            <a href="/patrocinadores">Patrocinadores</a>
          </nav>
        </div>
      </header>
    )
}