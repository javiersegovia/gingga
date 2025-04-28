# Gingga Monorepo

This repository contains the codebase for the Gingga project, structured as a monorepo using Turbo.

## 📦 Packages & Apps

The monorepo is organized into two main directories: `apps` and `packages`.

- **`apps/`**: Contains the user-facing applications.
  - `client`: The main web application built with React Router, Vite, React, Tailwind CSS, and Shadcn/UI. Hosted on Cloudflare Workers.
  - `api`: API built with Hono and tRPC, handling backend logic and authentication. Hosted on Cloudflare Workers.
- **`packages/`**: Contains shared libraries and configurations.
  - `db`: Drizzle ORM schemas, migrations, and database utilities using Turso (SQLite).
  - `ui`: Shared React UI components based on Shadcn/UI.
  - `tsconfig`: Shared TypeScript configurations.

## ✨ Core Technologies

- **Primary Language**: [TypeScript](https://www.typescriptlang.org/)
- **Web Client**: [React Router](https://reactrouter.com/) + [Vite](https://vitejs.dev/)
- **API Framework**: [Hono](https://hono.dev/)
- **RPC**: [tRPC](https://trpc.io/)
- **UI Framework**: [React](https://react.dev/) 19+
- **State**: [TanStack Query](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4+ + [Shadcn/UI](https://ui.shadcn.com/) (`packages/ui`)
- **Database**: [Turso](https://turso.tech/) (Serverless SQLite) + [Drizzle ORM](https://orm.drizzle.team/) (`packages/db`)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) (old) / [TanStack Form](https://tanstack.com/form/latest) (preferred)

- **Linting/Formatting**: ESLint, Prettier
- **Testing**: Vitest (planned)
- **Monorepo Management**: [Turbo](https://turbo.build/)
- **Runtime**: [Workerd with Node.js Compatibility](https://developers.cloudflare.com/workers/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 📋 Prerequisites

- [Pnpm](https://pnpm.io/installation) v10.9+
- [Turso CLI](https://docs.turso.tech/cli/installation/)
- Cloudflare Account (for deployment and types)
- Environment variables set up (see below)

## 🛠️ Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd gingga
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**

   - Copy `.dev.vars.example` to `.dev.vars` in `apps/api`. Create `.dev.vars.production` if needed for production API secrets.
   - Copy `.dev.vars.example` to `.dev.vars` in `apps/client`. Create `.dev.vars.production` for production client variables.
   - Copy `.env.example` to `.env` in `packages/db`.
   - Fill in the required variables (API keys, database URLs, etc.). See individual example files for details.

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
     pnpm run db:migrate
     ```

   - **Option 1: Use local file directly:** Ensure your `packages/db/.env` points `DATABASE_URL=./local.db`.
   - **Option 2: Run local libSQL server (for libSQL features):**

     ```bash
     pnpm run dev # This runs 'turso dev --db-file local.db'
     ```

     Connect your application to `http://127.0.0.1:8080` (set `DATABASE_URL` and `DATABASE_AUTH_TOKEN` accordingly in `.env` files). Refer to the [Turso Local Development Docs](https://docs.turso.tech/local-development).

   - Use `pnpm run db:studio` in `packages/db` to manage the database visually.

## 💻 Development

To start all applications in development mode (uses Turbo):

```bash
# Runs 'dev' script in both 'apps/api' and 'apps/client'
pnpm dev
```

Turbo automatically handles running the necessary dev servers concurrently. The `api` will typically run on port `8787` and the `client` on `5173`.

## 🚀 Deployment

Deployment involves building the applications for production and deploying them to Cloudflare Workers.

**1. Local/Manual Deployment:**

You can trigger a full production build and deployment of both the API and Client workers from the root directory using a single command:

```bash
# This command performs two main steps via Turbo:
# 1. Runs the 'build:prod' script in relevant packages (e.g., apps/client).
# 2. Runs the 'deploy' script in relevant packages (e.g., apps/api, apps/client).
pnpm deploy
```

Make sure your Cloudflare Wrangler is logged in (`npx wrangler login`) and your `.dev.vars.production` files (or Cloudflare secrets for CI) contain the necessary environment variables.

**2. Automated Deployment (GitHub Actions):**

The `.github/workflows/deploy.yml` workflow automates deployment on pushes to the `main` branch:

- **Checkout & Setup:** Checks out the code, sets up Node.js and pnpm.
- **Install Dependencies:** Runs `pnpm install --frozen-lockfile`.
- **Database Migrations:** Runs `pnpm run db:migrate --filter=@gingga/db` using secrets for credentials.
- **Build Production Apps:** Runs `pnpm run build:prod`. This uses Turbo to execute the `build:prod` script in necessary packages (like `apps/client`).
- **Deploy API Worker:** Uses `cloudflare/wrangler-action` to execute the API's deploy command (`pnpm run deploy --filter=~`).
- **Deploy Client Worker:** Uses `cloudflare/wrangler-action` to execute the Client's deploy command (`pnpm run deploy --filter=@gingga/client`).

This automated process ensures that database migrations and production builds are completed before the deployment commands are executed for each worker individually.

## 🛠️ Useful Commands

Run these commands from the **root directory** using `pnpm`:

- `pnpm dev`: Starts development servers for all apps.
- `pnpm build`: Builds all apps and packages using development configuration.
- `pnpm build:prod`: Builds all apps and packages using production configuration.
- `pnpm deploy`: Builds for production _and_ deploys apps (client & api) to Cloudflare.
- `pnpm start`: Runs the built apps locally (behavior depends on app implementations).
- `pnpm preview`: Previews the production build locally (client app).
- `pnpm lint`: Lints the codebase across apps and packages.
- `pnpm lint:fix`: Attempts to automatically fix linting issues.
- `pnpm typecheck`: Runs TypeScript type checking across the monorepo.

## 🔧 Configuration Files

- `turbo.json`: Turbo configuration for monorepo tasks.
- `eslint.config.ts`: ESLint configuration.
- `apps/client/vite.config.ts`: Vite configuration.
- `apps/client/wrangler.jsonc`: Client CF Worker configuration.
- `apps/api/wrangler.jsonc`: API CF Worker configuration.
- `packages/db/drizzle.config.ts`: Drizzle ORM configuration.
- `packages/tsconfig/base.json`: Base TypeScript configuration.

## 📝 License

Pending

## 👥 Contributing

Pending
