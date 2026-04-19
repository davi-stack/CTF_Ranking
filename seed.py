from supabase import create_client
import bcrypt
import uuid
import random
import string
import os

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

CHARSET = string.ascii_letters + string.digits + "!@#%&"

def gen_str(n):
    return "".join(random.choice(CHARSET) for _ in range(n))

USERS = 35
FLAGS_PER_USER = 5

for i in range(USERS):
    print("User"+ i)
    supabase.table("submissoes").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    supabase.table("flags").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    supabase.table("usuarios").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()

    user_id = str(uuid.uuid4())
    login = f"user{i+1}"
    nome = f"User{i+1}"

    plain = gen_str(12)
    hashed = bcrypt.hashpw(plain.encode(), bcrypt.gensalt(10)).decode()

    # 👤 INSERT USER
    supabase.table("usuarios").insert({
        "id": user_id,
        "nome": nome,
        "login": login,
        "pass": hashed
    }).execute()

    # 🚩 FLAGS
    for f in range(1, FLAGS_PER_USER + 1):
        supabase.table("flags").insert({
            "numero": f,
            "user_id": user_id,
            "value": gen_str(10)
        }).execute()

print("✅ Banco populado com sucesso!")