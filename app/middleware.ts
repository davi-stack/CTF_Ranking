import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// 🔓 rotas públicas (sem autenticação)
const publicRoutes = ["/", "/login", "/patrocinadores"];
const publicApiRoutes = ["/api/login"];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 1️⃣ permitir rotas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 2️⃣ permitir APIs públicas
  if (publicApiRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 3️⃣ verificar token para rotas protegidas
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // Redireciona para login se tentar acessar rota protegida
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 4️⃣ validar JWT
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET não configurada");
      throw new Error("JWT_SECRET não configurada");
    }

    jwt.verify(token, secret);
    return NextResponse.next();
  } catch (err) {
    console.error("JWT inválido:", err);

    // Redireciona para login se token inválido
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// ⚙️ configurar quais rotas usar middleware
export const config = {
  matcher: [
    // Proteger todas as rotas
    "/((?!_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)",
  ],
};
