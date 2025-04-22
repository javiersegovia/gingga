# Gingga Monorepo

This repository contains the codebase for the Gingga project, structured as a monorepo using Turbo.

## 📦 Packages & Apps

The monorepo is organized into two main directories: `apps` and `packages`.

- **`apps/`**: Contains the user-facing applications.
  - `web`: The main web application built with TanStack Start, React, Tailwind CSS, and Shadcn/UI. Deployed on Vercel/Cloudflare.
  - `api`: A Cloudflare Worker API built with Hono and tRPC, handling backend logic and authentication.
- **`packages/`**: Contains shared libraries and configurations.
  - `db`: Drizzle ORM schemas, migrations, and database utilities using Turso (SQLite).
  - `ui`: Shared React UI components based on Shadcn/UI.
  - `tsconfig`: Shared TypeScript configurations.

## ✨ Core Technologies

- **Monorepo Management**: [Turbo](https://turbo.build/)
- **Runtime**: API [Workerd] / Web [Node.js](https://nodejs.org/) >= 20
- **Package Manager**: [Bun](https://bun.sh/) (Managed via Bun)
- **Primary Language**: [TypeScript](https://www.typescriptlang.org/)
- **Web Framework**: [TanStack Start](https://tanstack.com/start/latest/)
- **API Framework**: [Hono](https://hono.dev/)
- **RPC**: [tRPC](https://trpc.io/)
- **UI Framework**: [React](https://react.dev/) 19+
- **Routing/State**: [TanStack Router](https://tanstack.com/router/latest), [TanStack Query](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4+
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) (`packages/ui`)
- **Database**: [Turso](https://turso.tech/) (Serverless SQLite)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) (`packages/db`)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) / [TanStack Form](https://tanstack.com/form/latest)
- **Deployment**: Vercel (Web App), Cloudflare Workers (API)
- **Linting/Formatting**: ESLint, Prettier
- **Testing**: Vitest (planned)

## 📋 Prerequisites

- [Bun](https://bun.sh/docs/installation) (We use only the package manager)
- [Turso CLI](https://docs.turso.tech/cli/installation/)
- Cloudflare Account (for API deployment and types)
- Vercel Account (for Web App deployment)
- Environment variables set up (see below)

## 🛠️ Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd gingga
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Configure Environment Variables:**

   - Copy `.dev.vars.example` to `.dev.vars` in the `apps/api`.
   - Copy `.env.example` to `.env` in the `apps/web`.
   - Copy `.env.example` to `.env` in the `packages/db`.
   - Fill in the required variables (API keys, database URLs, etc.).

4. **Setup Local Database (Turso):**

   - Navigate to the database package:

     ```bash
     cd packages/db
     ```

   - Create an empty database file:

     ```bash
     touch local.db
     ```

   - Apply the latest migrations to the new local database:

     ```bash
     bun run db:migrate
     ```

   - (Optional) To run a local libSQL server using this file for development (useful if using libSQL-specific features):

     ```bash
     bun run dev # This runs 'turso dev --db-file local.db'
     ```

     Connect your application to `http://127.0.0.1:8080` when using this method. Refer to the [Turso Local Development Docs](https://docs.turso.tech/local-development) for more details.

   - Alternatively, run `bunx drizzle-kit studio` in `packages/db` to manage the database visually.

## 💻 Development

To start all applications in development mode (uses Turbo):

```bash
bun run dev
```

This command runs the `dev` script defined in the `package.json` of each app/package concurrently.

You can also run specific apps using Turbo filters if needed (e.g., if you only want to work on the web app):

```bash
# Start only the web app
bun run dev --filter=@gingga/web...
```

## 🚀 Deployment

Build all apps and packages (uses Turbo):

```bash
bun run build
```

Deployment varies by application:

- **Web App (`apps/web`):**
  Typically deployed via Vercel integration connected to this repository. Manual deployment might involve building (`bun run build --filter=@gingga/web...`) and using the Vercel CLI.

- **API (`apps/api`):**
  Deploy using Cloudflare Wrangler. You need to be in the `apps/api` directory or use a filter:

  ```bash
  # Option 1: Navigate and deploy
  cd apps/api
  bun run deploy

  # Option 2: Deploy from root using filter
  # bun run deploy --filter=@gingga/api... # Note: 'deploy' script needs to be defined in root or use wrangler directly
  # Assuming wrangler is installed globally or via npx/bunx:
  bunx wrangler deploy --config ./apps/api/wrangler.toml
  ```

## 🛠️ Useful Commands

Run these commands from the root directory:

- **Linting (uses Turbo):**

  ```bash
  bun run lint
  bun run lint:fix
  ```

- **Type Checking (specific to apps/web):**
  Requires filtering as it's not a root script.

  ```bash
  bun run typecheck --filter=@gingga/web...
  # Or run from within apps/web: cd apps/web && bun run typecheck
  ```

- **Generate Cloudflare Types (for `apps/api`):**
  Requires filtering or running within the `apps/api` directory.

  ```bash
  bun run cf-typegen --filter=@gingga/api...
  # Or run from within apps/api: cd apps/api && bun run cf-typegen
  ```

- **Database Migrations (`packages/db`):**
  These commands need to be run within the `packages/db` directory (or using filters)

  ```bash
  # Generate migration files based on schema changes
  bun run db:generate

  # Apply migrations
  bun run db:migrate

  # Push schema changes directly (useful for development, resets DB)
  bun run db:push

  # Open Drizzle Studio
  bun run db:studio
  ```

## 🔧 Configuration Files

- `turbo.json`: Turbo configuration for monorepo tasks.
- `eslint.config.ts`: ESLint configuration.
- `apps/web/app.config.ts`: TanStack Start configuration.
- `apps/api/wrangler.jsonc`: Cloudflare Worker configuration.
- `packages/db/drizzle.config.ts`: Drizzle ORM configuration.
- `packages/tsconfig/base.json`: Base TypeScript configuration.

## 📝 License

Pending

## 👥 Contributing

Pending
