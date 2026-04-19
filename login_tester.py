import csv
import requests

URL = "http://localhost:3000/api/login"

def test_logins(csv_file):
    with open(csv_file, newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            login = row["login"]
            password = row["senha_original"]

            try:
                response = requests.post(URL, json={
                    "login": login,
                    "password": password
                })

                status = response.status_code

                if status == 200:
                    print(f"[✅ OK] {login}:{password}")
                else:
                    print(f"[❌ FAIL] {login}:{password} -> {response.text}")

            except Exception as e:
                print(f"[⚠️ ERRO] {login}:{password} -> {e}")

if __name__ == "__main__":
    test_logins("usuarios.csv")