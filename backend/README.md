# Elsie Backend

Go API for Eira Executive Operations using the standard `net/http` package, SQLite, and JWT-protected admin writes.

## Run

```sh
go run .
```

## Routes

- `POST /api/login`
- `GET /api/content`
- `POST /api/content`
- `GET /api/settings`
- `POST /api/settings`
- `GET /api/blocks`
- `POST /api/blocks`
- `DELETE /api/blocks/:id`
- `POST /api/upload`
- `GET /uploads/:filename`

## Environment

Copy `.env.example` to `.env` for local values. The real `.env` file is ignored by Git.
