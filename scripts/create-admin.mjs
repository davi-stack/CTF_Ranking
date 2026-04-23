import process from "node:process";

import bcrypt from "bcrypt";
import nextEnv from "@next/env";

import { createClient } from "@supabase/supabase-js";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} não configurada.`);
  }

  return value;
}

function getArg(name) {
  const prefix = `--${name}=`;
  const match = process.argv.find((value) => value.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

const login = getArg("login") ?? "admin";
const nome = getArg("nome") ?? "Administrador";
const password = getArg("password") ?? process.env.ADMIN_PASSWORD;

if (!password) {
  throw new Error("Informe a senha com --password=... ou via ADMIN_PASSWORD.");
}

const supabase = createClient(getEnv("NEXT_PUBLIC_SUPABASE_URL"), getEnv("SUPABASE_SERVICE_ROLE_KEY"));
const hashedPassword = await bcrypt.hash(password, 12);

const { data: existingUser } = await supabase
  .from("usuarios")
  .select("id")
  .eq("login", login)
  .maybeSingle();

if (existingUser) {
  const { error } = await supabase
    .from("usuarios")
    .update({
      nome,
      pass: hashedPassword,
      created_at: new Date().toISOString(),
    })
    .eq("id", existingUser.id);

  if (error) {
    throw new Error(`Falha ao atualizar admin: ${error.message}`);
  }

  console.log(`Usuário ${login} atualizado com sucesso.`);
} else {
  const { error } = await supabase.from("usuarios").insert({
    login,
    nome,
    pass: hashedPassword,
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Falha ao criar admin: ${error.message}`);
  }

  console.log(`Usuário ${login} criado com sucesso.`);
}

const defaultCatalog = [1, 2, 3, 4, 5].map((numero) => ({
  numero,
  titulo: `Flag ${numero}`,
  descricao: `Desafio ${numero}. Atualize esta descrição no painel administrativo.`,
  pontos: numero * 100,
  ativa: true,
  updated_at: new Date().toISOString(),
}));

const { error: catalogError } = await supabase
  .from("flag_catalog")
  .upsert(defaultCatalog, { onConflict: "numero" });

if (catalogError) {
  throw new Error(`Falha ao inicializar o catálogo das flags: ${catalogError.message}`);
}

console.log("Catálogo global de flags verificado com sucesso.");