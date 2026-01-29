# ftr-desafio-fase3-financy

Aplicação **Financy** do desafio (Fase 3), com **backend** e **frontend** separados.

## Estrutura

- `/backend` — API (GraphQL) + autenticação + regras de negócio
- `/frontend` — Web app (Vite + React) com React Query

---

## Requisitos

- Node.js (recomendado LTS)
- pnpm (recomendado)
- (Backend) Banco de dados conforme configuração do projeto (ver `.env.example`)

---

## Backend (`/backend`)

### 1) Configurar variáveis de ambiente

Crie um `.env` baseado no `.env.example`:

```bash
cp .env.example .env
````

Ajuste as variáveis (DB, secrets, etc).

### 2) Instalar dependências

```bash
cd backend
pnpm install
```

### 3) Rodar migrations / setup (se aplicável)

> Use o comando padrão do projeto (ex.: `pnpm db:migrate`, `pnpm prisma migrate`, etc).

### 4) Subir o servidor

```bash
pnpm dev
```

Backend disponível em: `http://localhost:4000/graphql`

---

## Frontend (`/frontend`)

### 1) Configurar variáveis de ambiente

Crie um `.env` baseado no `.env.example`:

```bash
cd frontend
cp .env.example .env
```

Ajuste a URL do backend (GraphQL) e flags de dev, se necessário.

### 2) Instalar dependências

```bash
pnpm install
```

### 3) Rodar o app

```bash
pnpm dev
```

Frontend disponível em: `http://localhost:5173`

---

## Scripts úteis

### Lint / Build

```bash
# frontend
cd frontend
pnpm lint
pnpm build

# backend
cd backend
pnpm lint
pnpm build
```

---

## Dev features (opcional)

Seed de dados fake:

- Frontend: `VITE_DEV_SEED_ENABLED=true` (Floating button na tela inicial)
- Backend: `DEV_SEED_ENABLED=true` (Query `isDevSeedEnabled` e Mutation `seedDevData`)
