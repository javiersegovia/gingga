# Project Overview: Gingga

## 1. Vision & Purpose (from agents-vision.mdc)

**Target Audience:** Small and medium businesses (SMBs), particularly non-technical users, and potentially end consumers for productivity or entertainment.

**Goal:** To create user-friendly AI agents ("Gingga Agents") capable of handling tasks like customer support, content creation, and personal assistance. The core aim is to make AI accessible through a friendly UI, prioritizing ease of use for non-technical individuals while providing depth for developers.

**Core Agent Components (BRAIN):**

- **Instructions:** System prompts and configuration to guide agent behavior.
- **Skills (Tools):** Curated, predefined actions (e.g., database queries, Slack posts, n8n workflows via composio.dev) for secure and predictable external interactions.
- **Workflows:** Sequences of tasks, potentially integrating with n8n or custom endpoints.
- **Knowledge:** A data engine allowing users to upload files (PDFs, text, images) which are vectorized for Retrieval-Augmented Generation (RAG), enabling agents to reference specific information.

**Customization & Control:**

- UI-first customization for prompts, instructions, and knowledge sources.
- Use of a curated skill library instead of open internet access.
- Drag-and-drop file uploads for knowledge base integration.

**Tooling:** Utilizes `composio.dev` for auth integrations and plans to use `n8n` for advanced workflows triggered via Skills. External API calls are restricted to the curated Skills.

**Privacy:** Currently minimal (agent instances own their data). Future plans include role-based access, sensitive data filtering, and multi-tenant separation.

**Commercial Strategy:**

- **Monetization:** One-time setup fees, tiered subscriptions (based on usage), and revenue sharing for agents listed on the marketplace.
- **Marketplace:** Curated and requires admin approval for listings. Will feature testimonials and case studies.

**Gamification:** Planned for the future (levels, achievements, reputation).

**Platform API & MCP:** An external API is planned to manage agents and chat, supporting the Model Context Protocol (MCP) for integration with clients like Claude or Cursor.

**Brand & Tone:** Playful, casual, and developer-friendly, minimizing jargon.

**Roadmap:**

- **Short-Term:** Basic agent skill expansion, marketplace curation, improved UI for non-tech users.
- **Long-Term:** Voice mode, advanced LLM fine-tuning, potential vertical solutions.

## 2. Technical Implementation (from README.md & agents-vision.mdc)

**Architecture:** Monorepo structure managed by **Turbo**.

**Core Technologies:**

- **Monorepo:** Turbo
- **Package Manager:** Pnpm
- **Languages:** TypeScript (strict), JavaScript (ES6+)
- **Runtime:**
  - API: Cloudflare Workers (Workerd)
  - Web: Node.js >= 20
- **Web Framework:** TanStack Start
- **API Framework:** Hono
- **RPC:** tRPC
- **UI Framework:** React 19+ (Functional Components + Hooks)
- **State/Routing:** TanStack Ecosystem (Router, Query, Table, Form)
- **Styling:** Tailwind CSS v4+
- **UI Components:** Shadcn/UI (via shared `packages/ui`)
- **Database:** Turso (Serverless SQLite)
- **ORM:** Drizzle ORM (schema in `packages/db`)
- **Authentication:** Better Auth
- **Validation:** Zod
- **Form Handling:** React Hook Form / TanStack Form
- **Linting/Formatting:** ESLint, Prettier
- **Deployment:**
  - Web App (`apps/web`): Vercel
  - API (`apps/api`): Cloudflare Workers

**Project Structure:**

├── apps/
│ ├── api/ # Cloudflare Worker API (Hono, tRPC)
│ └── web/ # Web Application (TanStack Start, React)
├── packages/
│ ├── db/ # Drizzle ORM schema, migrations (Turso/SQLite)
│ ├── ui/ # Shared React components (Shadcn/UI based)
│ └── tsconfig/ # Shared TypeScript configurations
├── bun.lockb
├── package.json # Root dependencies and scripts
└── turbo.json # Turbo configuration

**Development Workflow:**

- Install dependencies: `bun install`
- Configure environment variables: Copy `.dev.vars.example` to `.dev.vars` (API), `.env.example` to `.env` (Web & DB), and fill them.
- Setup local DB: `cd packages/db`, `touch local.db`, `bun run db:migrate`. Optionally run `bun run dev` in `packages/db` for a local libSQL server or use `bunx drizzle-kit studio`.
- Start development server (all apps): `bun run dev` (from root)
- Run commands across workspaces using Turbo (e.g., `bun run lint`).
- Run package-specific commands using `cd` or Turbo filters (e.g., `bun run db:migrate --filter=@gingga/db...`, `bun run cf-typegen --filter=~...`).

**Deployment:**

- Build all: `bun run build` (from root)
- Web (`apps/web`): Typically via Vercel Git integration.
- API (`apps/api`): Deploy via `wrangler deploy` (e.g., `cd apps/api && bun run deploy` or `bunx wrangler deploy --config ./apps/api/wrangler.toml`).

## 3. Coding Standards & Practices (from instructions.mdc)

- **Languages:** English preferred for all development and communication.
- **Code Style:**
  - Server Actions/Functions: `$actionName`
  - Booleans: `hasXxx`/`isXxx`/`shouldXxx`
  - Event Handlers: `handle[Element][Action]`
  - Files: `kebab-case`, Components: `PascalCase`, Variables/Functions: `camelCase`
  - Exports: Prefer named exports.
- **Best Practices:**
  - Strict TypeScript, avoid `any`.
  - Functional React components and hooks.
  - Error boundaries and loading states.
  - Prop validation.
  - Self-documenting code.
  - Accessibility.
  - Tailwind CSS (`cn()` utility from `~/lib/utils` for conditional classes).
  - Single-responsibility components.
  - Early returns.
  - Use `Icon` suffix for `lucide-react` imports.
  - Use modern JS features (destructuring, etc.).
- **Return Types:** Explicitly declare return types for top-level module functions (except React components).
