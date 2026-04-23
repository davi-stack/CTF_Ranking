import "server-only";

import { supabase } from "@/lib/supabase";
import type { FlagCatalogRow, FlagRow, ImportPreview, UserRow } from "@/lib/types";

type ImportUserRow = Pick<UserRow, "id" | "nome" | "login" | "pass">;
type ImportFlagRow = Pick<FlagRow, "id" | "numero" | "user_id" | "value">;

const REQUIRED_USER_COLUMNS = ["id", "login", "senha_hash"];
const REQUIRED_FLAG_COLUMNS = ["id", "numero", "user_id", "value"];

function parseCsv(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("CSV sem conteúdo suficiente");
  }

  const headers = lines[0].split(",").map((value) => value.trim());
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",");
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] || "").trim();
    });
    return row;
  });

  return rows;
}

function validateRequiredColumns(
  headers: string[],
  requiredColumns: string[],
  fileLabel: string
) {
  const missing = requiredColumns.filter((column) => !headers.includes(column));
  if (missing.length > 0) {
    throw new Error(`${fileLabel}: colunas obrigatórias ausentes -> ${missing.join(", ")}`);
  }
}

function parseCsvWithValidation(text: string, requiredColumns: string[], fileLabel: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error(`${fileLabel}: CSV sem conteúdo suficiente`);
  }

  const headers = lines[0].split(",").map((value) => value.trim());
  validateRequiredColumns(headers, requiredColumns, fileLabel);

  return parseCsv(text);
}

function defaultFlagCatalog(numero: number): FlagCatalogRow {
  return {
    numero,
    titulo: `Flag ${numero}`,
    descricao: `Desafio ${numero}. Edite a descrição no painel administrativo para orientar os competidores.`,
    pontos: Math.max(100, numero * 100),
    ativa: true,
  };
}

function loadCsvPreviewFromText(usersText: string, flagsText: string): ImportPreview {
  const users = parseCsvWithValidation(usersText, REQUIRED_USER_COLUMNS, "usuarios.csv");
  const flags = parseCsvWithValidation(flagsText, REQUIRED_FLAG_COLUMNS, "flags.csv");
  const numeros = [...new Set(flags.map((row) => Number(row.numero)).filter(Boolean))].sort((a, b) => a - b);

  return {
    usersCount: users.length,
    flagsCount: flags.length,
    numeros,
  };
}

function loadCsvPayloadFromText(usersText: string, flagsText: string) {
  const users = parseCsvWithValidation(usersText, REQUIRED_USER_COLUMNS, "usuarios.csv").map<ImportUserRow>((row) => ({
    id: row.id,
    nome: row.nome || row.login,
    login: row.login,
    pass: row.senha_hash,
  }));

  const flags = parseCsvWithValidation(flagsText, REQUIRED_FLAG_COLUMNS, "flags.csv").map<ImportFlagRow>((row) => ({
    id: row.id,
    numero: Number(row.numero),
    user_id: row.user_id,
    value: row.value,
  }));

  const catalog = [...new Set(flags.map((row) => row.numero))]
    .sort((a, b) => a - b)
    .map((numero) => defaultFlagCatalog(numero));

  return { users, flags, catalog };
}

export async function importCsvData(usersText: string, flagsText: string) {
  const { users, flags, catalog } = loadCsvPayloadFromText(usersText, flagsText);

  await supabase.from("submissoes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("flag_observacoes").delete().neq("numero", -1);
  await supabase.from("flags").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("usuarios").delete().neq("login", "admin");

  const { error: userError } = await supabase.from("usuarios").upsert(users, { onConflict: "id" });
  if (userError) {
    throw new Error(`Falha ao importar usuários: ${userError.message}`);
  }

  const { error: flagError } = await supabase.from("flags").upsert(flags, { onConflict: "id" });
  if (flagError) {
    throw new Error(`Falha ao importar flags: ${flagError.message}`);
  }

  const { error: catalogError } = await supabase
    .from("flag_catalog")
    .upsert(catalog, { onConflict: "numero" });

  if (catalogError) {
    throw new Error(`Falha ao importar catálogo das flags: ${catalogError.message}`);
  }

  return {
    usersCount: users.length,
    flagsCount: flags.length,
    numeros: catalog.map((item) => item.numero),
  };
}

export function getCsvPreview(usersText: string, flagsText: string): ImportPreview {
  return loadCsvPreviewFromText(usersText, flagsText);
}