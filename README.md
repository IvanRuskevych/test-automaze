# Tasks GraphQL App

A full-stack **task management app** built with **React, Apollo Client, Zustand, GraphQL, and PostgreSQL**.  
The backend is powered by **Node.js (Apollo Server / Express) with TypeScript**, using **GraphQL Codegen** for automatic
type generation.

![img.png](packages/frontend/docs/001.png)

## ![002.png](packages/frontend/docs/002.png)

## Project Structure

This project is organized as a **monorepo**:

```
monorepo/
├── package.json
├── tsconfig.base.json
├── tsconfig.eslint.json
├── node_modules/
├── packages/
│   ├── frontend/      <-- Frontend (Vite + React + TS)
│   └── backend/       <-- Backend (Express + TS)
└── eslint.config.js
```

> All dependencies (for both frontend and backend) are installed from the root of the monorepo.

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite, MUI, Zustand, Apollo Client
- **Backend:** Node.js, Express, Apollo Server, TypeScript, GraphQL Codegen
- **Database:** PostgreSQL (Docker)
- **ORM:** Prisma

---

## Requirements

Make sure you have the following installed:

- **Node.js ≥ 18**
- **Yarn**
- **Docker & Docker Compose**

---

## 1. Install Dependencies

From the root of the monorepo:

```bash
  yarn install
```

This will install packages for both `frontend` and `backend`.

---

## 2. Start PostgreSQL Database

```bash
  docker-compose up -d
```

After that, PostgreSQL will be available at `localhost:5432`  
(login: `postgres`, password: `postgres`, database: `todos_db`)

---

## 3. Backend Setup

Navigate to the backend package:

```bash
  cd packages/backend
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todos_db
PORT=4000
```

---

## 4. Initialize Database (Migrations + Seed Data)

### For using **Prisma**:

```bash
  npx prisma migrate dev --name init
  npx prisma db seed
```

> The seeder automatically creates **2 categories** and **5 sample tasks**.

---

## 5. Generate GraphQL Types (Codegen)

On the backend:

```bash
  npm run codegen
```

> This generates TypeScript types for queries, mutations, and the GraphQL schema (e.g., in `src/generated/graphql.ts`).

---

## 6. Start Backend Server

```bash
  npm run dev
```

Backend will be available at: [http://localhost:4000/graphql](http://localhost:4000/graphql)

---

## 7. Start Frontend App

Navigate to the frontend package:

```bash
  cd ../frontend
  npm run dev
```

Frontend will run at: [http://localhost:5173](http://localhost:5173)

> The React app connects to the backend via Apollo Client (`http://localhost:4000/graphql`).

---

## Verification Checklist

After setup, ensure:

- [x] GraphQL Playground opens at `http://localhost:4000/graphql`
- [x] Database contains 2 categories and 5 tasks
- [x] Frontend connects to backend and displays the task list
