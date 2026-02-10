# System zarządzania treścią blogową oparty na architekturze REST z użyciem Django REST Framework i React

Projekt inżynierski: System zarządzania treścią blogową oparty na architekturze REST z użyciem Django REST Framework i React.

## 🛠 Technologie
* **Backend:** Python 3.12, Django 5.0, Django REST Framework
* **Frontend:** React 18, Node.js
* **Baza danych:** PostgreSQL 16
* **Infrastruktura:** Docker, Docker Compose

## 🚀 Uruchomienie aplikacji (Windows / Linux / macOS)

Aplikacja jest w pełni skonteneryzowana. Do jej uruchomienia wymagane jest jedynie zainstalowanie środowiska **Docker** oraz **Docker Compose**.

(Dla uzytkownikow Windows zalecane jest korzystanie z terminala PowerShell.)
### Krok 1: Wejscie do głównego folderu
```bash
cd 10-I-INF-319708
```

### Krok 2: Uruchom system

W głównym katalogu projektu wykonaj polecenie:
```Bash
docker compose up --build
```
Uwaga: Pierwsze uruchomienie może potrwać kilka minut (budowanie obrazów). Skrypt automatycznie wykonuje migracje bazy danych oraz zasila ją danymi testowymi (użytkownicy, posty, zdjęcia).

### Dostęp do aplikacji

Po poprawnym uruchomieniu kontenery są dostępne pod następującymi adresami:
```bash
Usługa	Adres URL	Opis
Frontend	http://localhost:3000	Główny interfejs aplikacji
API Backend	http://localhost:8002/api/docs	Punkty końcowe REST API
```

### Dane testowe (Logowanie)

Podczas startu system automatycznie tworzy konta użytkowników (skrypt init_data).
1. Administrator (Superuser)

Ma pełny dostęp do wszystkich funkcji (edycja, usuwanie, panel admina).

    Login: admin

    Hasło: admin123

2. Przykładowy Użytkownik

Ma dostęp do komentowania i przeglądania.

    Login: jan_kowalski

    Hasło: user123
