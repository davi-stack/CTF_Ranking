from supabase import create_client
import os
import csv
from math import ceil

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

BATCH_SIZE = 200  # evita estourar limite do Supabase

# =========================
# FUNÇÃO DE BATCH
# =========================
def chunk_list(data, size):
    for i in range(0, len(data), size):
        yield data[i:i + size]

# =========================
# LIMPAR BANCO
# =========================
def limpar_banco():
    print("🧹 Limpando tabelas...")

    supabase.table("flags").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    supabase.table("usuarios").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()

    print("✅ Banco limpo\n")

# =========================
# LER CSV USUÁRIOS
# =========================
def ler_usuarios():
    usuarios = []

    with open("usuarios.csv", newline='', encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            usuarios.append({
                "id": row["id"],
                "nome": row["nome"],
                "login": row["login"],
                "pass": row["senha_hash"]  # 🔥 só hash
            })

    return usuarios

# =========================
# LER CSV FLAGS
# =========================
def ler_flags():
    flags = []

    with open("flags.csv", newline='', encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            flags.append({
                "id": row["id"],
                "numero": int(row["numero"]),
                "user_id": row["user_id"],
                "value": row["value"]
            })

    return flags

# =========================
# INSERIR COM BATCH
# =========================
def inserir_em_lotes(tabela, dados):
    total = len(dados)
    batches = list(chunk_list(dados, BATCH_SIZE))

    print(f"📦 Inserindo {total} registros em '{tabela}' ({len(batches)} batches)...")

    inseridos = 0

    for i, batch in enumerate(batches):
        try:
            supabase.table(tabela).insert(batch).execute()
            inseridos += len(batch)
            print(f"  ✔ Batch {i+1}/{len(batches)} inserido ({len(batch)} registros)")
        except Exception as e:
            print(f"  ❌ Erro no batch {i+1}: {e}")

    print(f"✅ Total inserido em '{tabela}': {inseridos}\n")
    return inseridos

# =========================
# MAIN
# =========================
def main():
    limpar_banco()

    usuarios = ler_usuarios()
    flags = ler_flags()

    total_usuarios = inserir_em_lotes("usuarios", usuarios)
    total_flags = inserir_em_lotes("flags", flags)

    print("🎯 RESUMO FINAL")
    print(f"Usuários inseridos: {total_usuarios}")
    print(f"Flags inseridas: {total_flags}")

if __name__ == "__main__":
    main()