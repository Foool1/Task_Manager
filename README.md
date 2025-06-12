# Task Manager

Prosta aplikacja backendowa do zarządzania zadaniami, zbudowana w Django + DRF + PostgreSQL.

## ✨ Główne funkcje

- Tworzenie oraz administracja zadan uzytkownikow
- Filtrowanie po wszystkich polach
- Historia zmian zadania (status, użytkownik itd.)
- Swagger UI z pełną dokumentacją pod `http://127.0.0.1:8000/api/docs`

## Uruchomienie

```bash
git clone https://github.com/Foool1/Task_Manager.git
cd Task_Manager
docker compose up --build

# Uzywanie aplikacji

Przejdź do: http://127.0.0.1:8000/api/docs

Zarejestruj nowego użytkownika przez endpoint: POST /api/register/

Zaloguj się przez: POST /api/login/

Skopiuj token z odpowiedzi i wpisz go w Swaggerze jako: Token <token otrzymany po zalogowaniu>
(przycisk "Authorize" w prawym górnym rogu)

###  Najważniejsze endpointy po zalogowaniu

- `GET /api/tasks/` – lista wszystkich zadań (z filtrowaniem)
- `POST /api/tasks/` – tworzenie nowego zadania
- `GET /api/tasks/{id}/` – szczegóły konkretnego zadania
- `PUT /api/tasks/{id}/` – pełna edycja zadania
- `PATCH /api/tasks/{id}/` – częściowa edycja zadania
- `DELETE /api/tasks/{id}/` – usunięcie zadania
