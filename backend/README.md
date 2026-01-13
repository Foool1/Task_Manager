# Blog

## Główne funkcje

- Swagger UI z pełną dokumentacją pod `http://127.0.0.1:8000/api/docs`

## Uruchomienie

```bash
git clone https://github.com/Foool1/Task_Manager.git
cd Blog
docker compose up --build
```

# Uzywanie aplikacji

Przejdź do: http://127.0.0.1:8000/api/docs

Zarejestruj nowego użytkownika przez endpoint: POST /api/register/

Zaloguj się przez: POST /api/login/

Skopiuj token z odpowiedzi i wpisz go w Swaggerze jako: Token <token otrzymany po zalogowaniu>
(przycisk "Authorize" w prawym górnym rogu)

###  Najważniejsze endpointy po zalogowaniu

- `GET /api/posts/` – lista wszystkich postow (z filtrowaniem)
- `POST /api/posts/` – tworzenie nowego postu
- `GET /api/posts/{id}/` – szczegóły konkretnego postu
- `PUT /api/posts/{id}/` – pełna edycja postu
- `PATCH /api/posts/{id}/` – częściowa edycja postu
- `DELETE /api/posts/{id}/` – usunięcie postu
