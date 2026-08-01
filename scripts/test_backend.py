import requests
import time
import sys

BASE_URL = "http://127.0.0.1:4000"

def print_result(name, passed, details=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status} | {name} {f'- {details}' if details else ''}")
    if not passed:
        sys.exit(1)

print("\n--- DÉMARRAGE DES TESTS BACKEND (Sécurité & API) ---\n")

try:
    # 1. Test de l'endpoint Prayer Times (Succès)
    res = requests.get(f"{BASE_URL}/prayer-times?city=Paris&country=France")
    print_result("Prayer Times (Valide)", res.status_code == 200)

    # 2. Test de l'endpoint Prayer Times (Erreur - Zod Validation)
    res = requests.get(f"{BASE_URL}/prayer-times")
    print_result("Prayer Times (Validation Manquante)", res.status_code == 400)

    # 3. Test de sécurité: HPP (HTTP Parameter Pollution)
    res = requests.get(f"{BASE_URL}/prayer-times?city=Paris&city=Lyon&country=France")
    # HPP middleware will pass only the last parameter (Lyon) so it shouldn't crash with a 500 Array error.
    print_result("HPP (Parameter Pollution Protection)", res.status_code in [200, 400])

    # 4. Test du Chatbot (Validation)
    res = requests.post(f"{BASE_URL}/api/chat", json={})
    print_result("Chatbot (Validation Manquante)", res.status_code == 400)

    # 5. Test de sécurité: Rate Limiting
    print("Test du Rate Limiter (envoi de requêtes rapides)...")
    rate_limit_hit = False
    for i in range(120):
        res = requests.get(f"{BASE_URL}/prayer-times?city=Paris&country=France")
        if res.status_code == 429:
            rate_limit_hit = True
            break
    print_result("Global Rate Limiter (Protection Anti-DDoS)", rate_limit_hit, "429 Too Many Requests reçu")

    print("\n--- TOUS LES TESTS BACKEND SONT RÉUSSIS ---")

except requests.exceptions.ConnectionError:
    print("❌ FAIL | Le serveur backend n'est pas lancé sur http://localhost:3001")
    sys.exit(1)
