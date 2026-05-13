# SisContrato CAU/DF

Platform for generating architecture and urbanism service contracts for architects registered at CAU/DF.

## Prerequisites

- [Bun](https://bun.sh) >= 1.x

## Installation

```bash
bun install
```

## Development

Start both backend and frontend simultaneously:

```bash
bun dev
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

### Health check

Verify the backend is running:

```bash
curl http://localhost:3000/health
# {"status":"ok"}
```

### Proxy

The Vite dev server proxies `/api/*` requests to the backend. To verify:

```bash
curl http://localhost:5173/api/health
# {"status":"ok"}
```

## Testing

Run all tests (backend + frontend):

```bash
bun test
```

## Build

Generate production artifacts for both projects:

```bash
bun run build
```

- Backend: type-check only (`tsc --noEmit`) — Bun runs TypeScript directly at runtime
- Frontend: compiled to `frontend/dist/`

## Project Structure

```
/
├── package.json          # Bun workspace root — orchestrates dev, test, build
├── bun.lock              # Single lockfile for all workspaces
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── eslint.config.ts
│   ├── .env.example      # Environment variable template
│   └── src/
│       ├── index.ts      # Server entry point (Hono + Bun.serve)
│       ├── lib/
│       │   └── env.ts    # Environment variable parsing and validation
│       ├── routes/
│       │   ├── health.ts       # GET /health handler
│       │   └── health.test.ts  # Health route tests
│       ├── services/     # Business logic (future features)
│       └── templates/    # Document templates (future features)
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts    # Vite config with /api proxy to backend
│   ├── vitest.config.ts
│   ├── eslint.config.ts
│   └── src/
│       ├── main.tsx      # React entry point
│       ├── App.tsx       # Router root
│       ├── pages/
│       │   └── home.tsx          # Route /
│       ├── store/
│       │   ├── form-store.ts     # Zustand store for multi-step form
│       │   └── form-store.test.ts
│       ├── components/   # Shared UI components (future features)
│       ├── hooks/        # Custom React hooks (future features)
│       └── lib/          # Utilities (future features)
└── spec/
    └── tasks/            # Product requirements and tech specs per feature
```

## Environment Variables

Copy the example file and adjust as needed:

```bash
cp backend/.env.example backend/.env
```

| Variable      | Default                   | Description               |
|---------------|---------------------------|---------------------------|
| `PORT`        | `3000`                    | Backend server port       |
| `NODE_ENV`    | `development`             | Runtime environment       |
| `CORS_ORIGIN` | `http://localhost:5173`   | Allowed CORS origin       |
