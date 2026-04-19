import requests

BASE_URL = "http://localhost:3000"
ORIGIN = BASE_URL
LOGIN = "user1"
PASSWORD = "ih9fI7nyBPgl"
TIMEOUT = 10

PUBLIC_GET_ROUTES = [
    ("/", 200),
    ("/login", 200),
    ("/patrocinadores", 200),
]

PROTECTED_GET_ROUTES = [
    ("/ctf", 200, 307),
    ("/ctf/ranking", 200, 307),
    ("/ctf/submit", 200, 307),
    ("/challenge", 307, 307),
    ("/api/me", 200, 401),
    ("/api/ranking", 200, 401),
]


def print_result(label: str, route: str, status_code: int, expected: tuple[int, ...]) -> bool:
    ok = status_code in expected
    icon = "OK" if ok else "FAIL"
    expected_text = ", ".join(str(item) for item in expected)
    print(f"[{icon}] {label:<10} {route:<18} -> {status_code} (esperado: {expected_text})")
    return ok


def create_session() -> requests.Session:
    session = requests.Session()
    session.headers.update({"Accept": "application/json, text/html;q=0.9,*/*;q=0.8"})
    return session


def login(session: requests.Session) -> bool:
    response = session.post(
        f"{BASE_URL}/api/login",
        json={"login": LOGIN, "password": PASSWORD},
        headers={"Origin": ORIGIN},
        timeout=TIMEOUT,
    )

    if response.status_code != 200:
        print(f"[FAIL] Login falhou -> {response.status_code} | {response.text}")
        return False

    cookie_names = sorted(session.cookies.keys())
    if "token" not in cookie_names:
        print(f"[FAIL] Login sem cookie de sessao. Cookies recebidos: {cookie_names}")
        return False

    try:
        payload = response.json()
    except ValueError:
        payload = {}

    user = payload.get("user", {})
    print(f"[OK] Login realizado para {user.get('login', LOGIN)}. Cookies: {cookie_names}")
    return True


def test_public_routes() -> bool:
    print("\nRotas publicas")
    session = create_session()
    success = True

    for route, expected_status in PUBLIC_GET_ROUTES:
        response = session.get(f"{BASE_URL}{route}", allow_redirects=False, timeout=TIMEOUT)
        success &= print_result("publica", route, response.status_code, (expected_status,))

    return success


def test_protected_routes() -> bool:
    print("\nRotas protegidas")
    anonymous = create_session()
    authenticated = create_session()

    if not login(authenticated):
        return False

    success = True

    for route, expected_with_session, expected_without_session in PROTECTED_GET_ROUTES:
        without_session = anonymous.get(f"{BASE_URL}{route}", allow_redirects=False, timeout=TIMEOUT)
        with_session = authenticated.get(f"{BASE_URL}{route}", allow_redirects=False, timeout=TIMEOUT)

        success &= print_result("sem sessao", route, without_session.status_code, (expected_without_session,))
        success &= print_result("com sessao", route, with_session.status_code, (expected_with_session,))
        print("-" * 72)

    return success


def test_logout() -> bool:
    print("\nLogout")
    session = create_session()
    if not login(session):
        return False

    response = session.post(
        f"{BASE_URL}/api/logout",
        headers={"Origin": ORIGIN},
        timeout=TIMEOUT,
    )

    ok = print_result("logout", "/api/logout", response.status_code, (200,))
    after_logout = session.get(f"{BASE_URL}/api/me", allow_redirects=False, timeout=TIMEOUT)
    ok &= print_result("pos logout", "/api/me", after_logout.status_code, (401,))
    return ok


if __name__ == "__main__":
    overall_success = True
    overall_success &= test_public_routes()
    overall_success &= test_protected_routes()
    overall_success &= test_logout()

    print("\nResumo")
    print("[OK] Todos os checks passaram." if overall_success else "[FAIL] Houve falhas nos checks.")