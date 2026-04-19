import csv
import time
from collections import defaultdict

import requests

USER_CSV = "usuarios.csv"
FLAGS_CSV = "flags.csv"
BASE_URL = "http://localhost:3000"
ORIGIN = BASE_URL
TIMEOUT = 10
DELAY_BETWEEN_USERS_SECONDS = 2


def create_session() -> requests.Session:
    session = requests.Session()
    session.headers.update({
        "Accept": "application/json",
        "Content-Type": "application/json",
    })
    return session


def parse_json(response: requests.Response) -> dict:
    try:
        data = response.json()
        return data if isinstance(data, dict) else {"data": data}
    except ValueError:
        return {"raw": response.text}


def login_user(base_url: str, login: str, password: str) -> requests.Session | None:
    session = create_session()

    try:
        response = session.post(
            f"{base_url}/api/login",
            json={"login": login, "password": password},
            headers={"Origin": ORIGIN},
            timeout=TIMEOUT,
        )
    except requests.RequestException as exc:
        print(f"[ERROR] Login {login}: {exc}")
        return None

    payload = parse_json(response)
    if response.status_code != 200:
        print(f"[FAIL] Login inválido: {login} ({response.status_code}) -> {payload}")
        return None

    if "token" not in session.cookies:
        print(f"[FAIL] Login sem cookie de sessão: {login}")
        return None

    print(f"[OK] Login válido: {login}")
    return session


def get_authenticated_user(session: requests.Session, base_url: str) -> dict | None:
    try:
        response = session.get(f"{base_url}/api/me", timeout=TIMEOUT)
    except requests.RequestException as exc:
        print(f"[ERROR] /api/me: {exc}")
        return None

    payload = parse_json(response)
    if response.status_code != 200:
        print(f"[FAIL] /api/me retornou {response.status_code} -> {payload}")
        return None

    return payload.get("user")


def get_competition_status(session: requests.Session, base_url: str) -> tuple[bool | None, dict]:
    try:
        response = session.get(f"{base_url}/api/ranking", timeout=TIMEOUT)
    except requests.RequestException as exc:
        return None, {"error": str(exc)}

    if response.status_code == 200:
        return True, {}

    return None, parse_json(response)


def submit_flag(session: requests.Session, base_url: str, numero: int, value: str) -> dict:
    try:
        response = session.post(
            f"{base_url}/api/submit-flag",
            json={"numero": numero, "value": value},
            headers={"Origin": ORIGIN},
            timeout=TIMEOUT,
        )
    except requests.RequestException as exc:
        return {"status_code": 0, "response": {"error": str(exc)}}

    return {
        "status_code": response.status_code,
        "response": parse_json(response),
    }


def load_flags_grouped(flags_csv: str) -> dict[str, list[dict]]:
    grouped = defaultdict(list)

    with open(flags_csv, newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            grouped[row["user_id"]].append(
                {
                    "id": row["id"],
                    "numero": int(row["numero"]),
                    "value": row["value"],
                }
            )

    return dict(grouped)


def load_users(user_csv: str) -> list[dict]:
    with open(user_csv, newline="", encoding="utf-8") as file:
        return list(csv.DictReader(file))


def print_submit_result(label: str, login: str, numero: int, result: dict, expected_status: tuple[int, ...]) -> bool:
    status_code = result["status_code"]
    payload = result["response"]
    ok = status_code in expected_status
    icon = "OK" if ok else "FAIL"
    expected_text = ", ".join(str(item) for item in expected_status)
    print(f"[{icon}] {label} | user={login} flag={numero} -> {status_code} (esperado: {expected_text}) | {payload}")
    return ok


def main() -> None:
    grouped_flags = load_flags_grouped(FLAGS_CSV)
    users = load_users(USER_CSV)
    overall_success = True
    competition_running = None
    first_user = None

    for row in users:
        login = row["login"]
        password = row["senha_original"]
        user_id = row["id"]

        print(f"\n=== Testando {login} ===")
        session = login_user(BASE_URL, login, password)
        if not session:
            overall_success = False
            continue

        authenticated_user = get_authenticated_user(session, BASE_URL)
        if not authenticated_user:
            overall_success = False
            continue

        if authenticated_user.get("id") != user_id:
            print(f"[FAIL] /api/me retornou id inesperado para {login}: {authenticated_user}")
            overall_success = False
            continue

        if competition_running is None:
            competition_running, payload = get_competition_status(session, BASE_URL)
            if competition_running is None:
                print(f"[WARN] Não foi possível inferir estado da competição via API pública: {payload}")
                competition_running = False

        flags = grouped_flags.get(user_id, [])
        if not flags:
            print(f"[WARN] Nenhuma flag encontrada para {login}")
            continue

        if not competition_running:
            sample = flags[0]
            result = submit_flag(session, BASE_URL, sample["numero"], sample["value"])
            overall_success &= print_submit_result(
                "competicao parada",
                login,
                sample["numero"],
                result,
                (409,),
            )
        else:
            for flag in flags:
                result = submit_flag(session, BASE_URL, flag["numero"], flag["value"])
                overall_success &= print_submit_result(
                    "submissao propria",
                    login,
                    flag["numero"],
                    result,
                    (200, 409),
                )

                if result["status_code"] == 200 and result["response"].get("correta") is not True:
                    overall_success = False

            if first_user and first_user["id"] != user_id:
                foreign_flag = grouped_flags[first_user["id"]][0]
                result = submit_flag(session, BASE_URL, foreign_flag["numero"], foreign_flag["value"])
                overall_success &= print_submit_result(
                    f"flag de outro usuario ({first_user['login']})",
                    login,
                    foreign_flag["numero"],
                    result,
                    (404,),
                )

        if first_user is None:
            first_user = {"id": user_id, "login": login}

        time.sleep(DELAY_BETWEEN_USERS_SECONDS)

    print("\n=== Resumo ===")
    print("[OK] Todos os checks passaram." if overall_success else "[FAIL] Houve falhas nos checks.")


if __name__ == "__main__":
    main()
                

            

