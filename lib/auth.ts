import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { supabase } from "@/lib/supabase";
import type { SessionUser, UserRow } from "@/lib/types";

const SESSION_COOKIE = "token";
const SESSION_TTL_SECONDS = 60 * 60 * 6;

type JwtPayload = {
  id: string;
  login: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET não configurado");
  }

  return secret;
}

function isAdminLogin(login: string) {
  return login.trim().toLowerCase() === "admin";
}

export function createSessionToken(user: Pick<UserRow, "id" | "login">) {
  return jwt.sign({ id: user.id, login: user.login }, getJwtSecret(), {
    expiresIn: SESSION_TTL_SECONDS,
  });
}

export function applySessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });
}

function decodeSessionToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    return null;
  }
}

async function loadSessionUserFromPayload(payload: JwtPayload | null): Promise<SessionUser | null> {
  if (!payload?.id) {
    return null;
  }

  const { data, error } = await supabase
    .from("usuarios")
    .select("id, login, nome")
    .eq("id", payload.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    login: data.login,
    nome: data.nome,
    isAdmin: isAdminLogin(data.login),
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  return loadSessionUserFromPayload(decodeSessionToken(token));
}

export async function getSessionUserFromRequest(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  return loadSessionUserFromPayload(decodeSessionToken(token));
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdminUser() {
  const user = await requireSessionUser();
  if (!user.isAdmin) {
    redirect("/ctf");
  }

  return user;
}

export async function requireApiUser(request: NextRequest) {
  return getSessionUserFromRequest(request);
}

export async function requireApiAdmin(request: NextRequest) {
  const user = await getSessionUserFromRequest(request);
  if (!user?.isAdmin) {
    return null;
  }

  return user;
}