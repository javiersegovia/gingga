# Migration Plan: TanStack Server Functions to tRPC Routers

This document outlines the process for migrating feature logic from TanStack Server Functions (`createServerFn`) located in `apps/web/src/features` to tRPC routers within the `apps/api/src/features` directory. Corresponding TanStack Query hooks will be relocated and updated in `apps/client/src/features`.

## Goal

Refactor the backend communication layer from TanStack Server Functions to tRPC for improved type safety, developer experience, and potentially better performance characteristics inherent in tRPC's batching and protocol.

## Affected Packages

- `apps/web`: Source of original feature files (`.api.ts`, `.service.ts`, `.schema.ts`, `.types.ts`). Will eventually have these files removed (except components). `.query.ts` files will be removed.
- `apps/api`: Destination for new tRPC routers (`.router.ts`) and relocated `.service.ts`, `.schema.ts`, `.types.ts` files.
- `apps/client`: Destination for new/updated TanStack Query hooks (`.query.ts`) that consume the tRPC API.

## Identified Features for Migration

Based on the contents of `apps/web/src/features`:

- `auth`
- `ai`
- `chat`
- `admin`
- `agent`
- `permissions`
- `rate-limit`
- `settings`
- `sidebar`
- `contact`

## General Migration Steps (Per Feature)

The following steps should be repeated for _each_ feature listed above. We will use the `agent` feature as a concrete example.

**Important Rules for Migration:**

- **No Extra Comments:** Do not add comments to the code beyond what is necessary for understanding complex logic. Avoid obvious comments.
- **Preserve Schemas:** When moving schema files (`.schema.ts`), do **not** remove or modify existing fields. Migrate the schemas as they are. Only remove entire schemas if they are purely for UI/form logic and not used by any API endpoint.
- **No New Queries/Mutations:** Only create tRPC procedures and corresponding client hooks for the existing server functions (`createServerFn`) found in the original `.api.ts` file. Do not introduce new queries or mutations that didn't have a server function counterpart.

**Feature Example: `agent`**

**1. Analyze Source Files (`apps/web/src/features/agent`):**

- Identify the core logic within:
  - `agent.api.ts`: Contains `createServerFn` definitions (e.g., `$getAgent`, `$createAgent`, `$updateAgent`, `$deleteAgent`). Note the input validation schemas, middleware used (especially `authMiddleware`), the exact function names (e.g., `$getAgentById`), and the service functions called.
  - `agent.service.ts`: Contains business logic and database interactions. Note its dependencies (e.g., `getDatabase` call, ORM functions, other services) and whether it requires user context.
  - `agent.schema.ts`: Contains Zod schemas for inputs, outputs, and potentially UI forms.
  - `agent.types.ts`: Contains any specific TypeScript types for this feature.
  - `agent.query.ts`: Contains TanStack Query hooks (`useQuery`, `useMutation`) calling the `createServerFn` functions.

**2. Prepare API Target Directory (`apps/api/src/features/agent`):**

- Create the directory if it doesn't exist.

**3. Migrate Shared Files:**

- **Move** `apps/web/src/features/agent/agent.service.ts` to `apps/api/src/features/agent/agent.service.ts`.
  - **Crucially:** Edit the moved service file.
    - Update all database operations to use the `getDB()` function imported from `~/context`. Remove any `db` parameters from function signatures if they existed.
    - If service functions require user context (like `userId`), ensure they obtain it internally (e.g., potentially via context available from `getDB` or other auth helpers), rather than expecting it to be passed directly as a parameter from the tRPC router layer, unless absolutely necessary for the logic. Adapt function signatures accordingly.
- **Move** `apps/web/src/features/agent/agent.schema.ts` to `apps/api/src/features/agent/agent.schema.ts`.
  - **Review and Refine:** Ensure this file contains all Zod schemas required for input validation in the corresponding tRPC router (`.router.ts`) and any schemas used internally by the service (`.service.ts`). Schemas used _purely_ for client-side form validation or UI logic and _not_ used as input to any API procedure can potentially be removed from this file (they might remain in `apps/web` or `apps/client`). Remove any `formOptions` exports. Update imports if necessary.
- **Move** `apps/web/src/features/agent/agent.types.ts` to `apps/api/src/features/agent/agent.types.ts` (if it exists).
  - Update imports if necessary.

**4. Create tRPC Router (`apps/api/src/features/agent/agent.router.ts`):**

- Create the new file.
- Define a tRPC router using `router` from `~/trpc`.
- For _each function_ previously defined in `.api.ts`:
  - Create a corresponding tRPC procedure. **IMPORTANT:** The procedure name MUST match the original server function name, but without the `$` prefix (e.g., `$getAgentById` becomes a procedure named `getAgentById`).
  - Use `publicProcedure` or `protectedProcedure` based on whether the original Server Function used auth middleware.
  - Use `.input()` to define input validation. You can:
    - Import and use schemas from the migrated `agent.schema.ts`.
    - Define simple schemas inline (e.g., `z.object({ id: z.string() })`).
    - Extend imported schemas (e.g., `ImportedSchema.extend({ ... })`).
  - Define the `.query()` or `.mutation()` handler.
  - Inside the handler, call the corresponding function from the migrated `agent.service.ts`. Pass the validated `input` object. Access context via `ctx` (e.g., `ctx.user`) _only if_ absolutely necessary for the handler logic itself or if the service function signature explicitly requires it (which should be avoided if possible, see Step 3).
  - Ensure the data returned by the handler matches the structure expected by the client-side query hooks (e.g., return `{ agents }` if the client expects an object with an `agents` array).

```typescript
import { TRPCError } from '@trpc/server'
import { z } from 'zod' // Import Zod for inline schemas
// Example Snippet for apps/api/src/features/agent/agent.router.ts
import { protectedProcedure, publicProcedure, router } from '~/trpc'
// Import necessary schemas (e.g., form schemas used as input)
import { AgentFormSchema /* ... other schemas */ } from './agent.schema'
import {
  createAgent,
  deleteAgentById,
  getAgentById,
  getAgents,
  getRecentAgentsForUser,
  updateAgentById,
  /* ... other service functions */
} from './agent.service'

export const agentRouter = router({
  // Procedure name matches original $getAgentById
  getAgentById: protectedProcedure
    .input(z.object({ id: z.string() })) // Use inline schema for simple input
    .query(async ({ input }) => {
      const agent = await getAgentById(input.id)
      if (!agent) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
      }
      return agent
    }),

  // Procedure name matches original $getAgents
  getAgents: protectedProcedure
    .query(async () => { // No input needed
      const agents = await getAgents()
      return { agents } // Match client expectation
    }),

  // Procedure name matches original $getRecentChatsWithAgents
  getRecentChatsWithAgents: protectedProcedure
    .query(async ({ ctx }) => { // Access ctx only if needed (e.g., user ID for service)
      // Service function obtains userId itself or via param if necessary
      const agents = await getRecentAgentsForUser(ctx.user.id)
      return { agents } // Match client expectation
    }),

  // Procedure name matches original $createAgent
  createAgent: protectedProcedure
    .input(AgentFormSchema) // Use schema from agent.schema.ts
    .mutation(async ({ input /* ctx removed if service handles context */ }) => {
      // Service function createAgent handles getting userId if needed
      const newAgent = await createAgent(input)
      return newAgent
    }),

  // Procedure name matches original $updateAgentById
  updateAgentById: protectedProcedure
    .input(AgentFormSchema.extend({ id: z.string() })) // Extend schema
    .mutation(async ({ input }) => {
      const agent = await updateAgentById(input) // Service needs full input
      if (!agent) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
      }
      return agent
    }),

  // Procedure name matches original $deleteAgentById
  deleteAgentById: protectedProcedure
    .input(z.object({ id: z.string() })) // Use inline schema
    .mutation(async ({ input }) => {
      const result = await deleteAgentById(input.id)
      if (!result.success) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
      }
      return result
    }),

  // ... other procedures
})

export type AgentRouter = typeof agentRouter
```

**5. Update Main API Router (`apps/api/src/trpc/routers/index.ts`):**

- Import the newly created `agentRouter`.
- Add it to the main `appRouter`.

```typescript
import { agentRouter } from '~/features/agent/agent.router' // <-- Import new router
// Example Snippet for apps/api/src/trpc/routers/index.ts
import { router } from '../index'
import { authRouter } from './auth.router'

export const appRouter = router({
  // ... existing routers
  auth: authRouter,
  agent: agentRouter, // <-- Add new router
})

export type TRPCAppRouter = typeof appRouter
```

**6. Prepare Client Target Directory (`apps/client/src/features/agent`):**

- Create the directory if it doesn't exist.

**7. Create Client Query File (`apps/client/src/features/agent/agent.query.ts`):**

- Create the new file.
- Import `useQuery`, `useMutation`, `useQueryClient` from `@tanstack/react-query`.
- Import the `useTRPC` hook (e.g., from `~/lib/trpc/react`).
- For _each procedure_ defined in `agent.router.ts`:
  - **Simplify Hook Usage:** Pass the result of `trpc.agent.<procedure_name>.queryOptions(...)` or `trpc.agent.<procedure_name>.mutationOptions(...)` _directly_ to `useQuery` or `useMutation`.
  - **`queryOptions` / `mutationOptions` Arguments:**
    - If the procedure takes input, pass the input object as the _first_ argument to `queryOptions`/`mutationOptions`.
    - If you need to pass TanStack Query options (like `enabled`, `onSuccess`, `select`), pass the options object as the _second_ argument.
    - If the procedure takes _no input_ and you _don't_ need to pass RQ options, call `queryOptions()` or `mutationOptions()` with no arguments. Avoid passing `undefined` unless passing a second argument.
  - Use `queryClient.invalidateQueries` within mutation `onSuccess` callbacks, referencing the query keys generated by tRPC helpers (e.g., `trpc.agent.<query_procedure_name>.queryKey(...)`). Ensure the procedure names used here match the actual procedure names in the router (e.g., `getAgents`, not `listAgents`).
  - Refer to the official tRPC TanStack Query usage docs: https://trpc.io/docs/client/tanstack-react-query/usage

```typescript
import type { Agent } from '~/features/agent/agent.types' // Adjust path as needed
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '~/lib/trpc/react' // Adjust path if needed

// Query Hook for fetching a single agent
export function useGetAgentByIdQuery(agentId: string | undefined) {
  const trpc = useTRPC()
  // Pass input as first arg, RQ options as second
  return useQuery(trpc.agent.getAgentById.queryOptions({ id: agentId! }, { enabled: !!agentId }))
}

// Query Hook for listing all agents - Use correct procedure name: getAgents
export function useGetAgentsQuery() { // Renamed hook for consistency
  const trpc = useTRPC()
  // No input, no options needed
  return useQuery(trpc.agent.getAgents.queryOptions())
}

// Query Hook for recent agents - Use correct procedure name: getRecentChatsWithAgents
export function useGetRecentChatsWithAgentsQuery() { // Renamed hook
  const trpc = useTRPC()
  // No input, no options needed
  return useQuery(trpc.agent.getRecentChatsWithAgents.queryOptions())
}

// Mutation Hook for creating an agent
export function useCreateAgentMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  // Pass options directly to mutationOptions
  return useMutation(trpc.agent.createAgent.mutationOptions({
    onSuccess: (createdAgent: Agent) => { // Add type for clarity
      // Use correct query key from getAgents procedure
      queryClient.invalidateQueries({ queryKey: trpc.agent.getAgents.queryKey() })

      queryClient.setQueryData(
        trpc.agent.getAgentById.queryKey({ id: createdAgent.id }),
        createdAgent
      )
      // Use correct query key from getRecentChatsWithAgents procedure
      queryClient.invalidateQueries({ queryKey: trpc.agent.getRecentChatsWithAgents.queryKey() })
    },
    // onError, onSettled etc.
  }),
  )
}

// Mutation Hook for updating an agent - Use correct procedure name: updateAgentById
export function useUpdateAgentMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(trpc.agent.updateAgentById.mutationOptions({ // Use correct procedure name
    onSuccess: (updatedAgent: Agent | null) => { // Add type
      if (!updatedAgent)
        return // Handle null case if service returns null
      // Use correct query key from getAgents procedure
      queryClient.invalidateQueries({ queryKey: trpc.agent.getAgents.queryKey() })

      queryClient.setQueryData(
        trpc.agent.getAgentById.queryKey({ id: updatedAgent.id }),
        updatedAgent
      )
      // Use correct query key from getRecentChatsWithAgents procedure
      queryClient.invalidateQueries({ queryKey: trpc.agent.getRecentChatsWithAgents.queryKey() })
    },
  }),
  )
}

// Mutation Hook for deleting an agent - Use correct procedure name: deleteAgentById
export function useDeleteAgentMutation() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  return useMutation(trpc.agent.deleteAgentById.mutationOptions({ // Use correct procedure name
    onSuccess: (data, variables) => { // data is { success: boolean }
      if (!data.success)
        return // Optional: check success flag

      // Use correct query key from getAgents procedure
      queryClient.invalidateQueries({ queryKey: trpc.agent.getAgents.queryKey() })

      queryClient.removeQueries({
        queryKey: trpc.agent.getAgentById.queryKey({ id: variables.id }), // variables holds input { id: '...' }
      })
      // Use correct query key from getRecentChatsWithAgents procedure
      queryClient.invalidateQueries({ queryKey: trpc.agent.getRecentChatsWithAgents.queryKey() })
    },
  }),
  )
}

// ... other hooks
```

## Repeat

Repeat steps 1-8 for all other identified features.

---

**AI Assistant Prompt (for executing one feature migration):**

```
Okay, let's migrate the `<FEATURE_NAME>` feature from TanStack Server Functions to tRPC.

Please perform the following steps based on the updated migration plan in `docs/ideation/migrate-serverFn-to-trpc.md`:

1.  **Read Source Files:** Read the contents of:
    -   `apps/web/src/features/<FEATURE_NAME>/<FEATURE_NAME>.api.ts` (Note original function names, e.g., `$getSomething`)
    -   `apps/web/src/features/<FEATURE_NAME>/<FEATURE_NAME>.service.ts`
    -   `apps/web/src/features/<FEATURE_NAME>/<FEATURE_NAME>.schema.ts`
    -   `apps/web/src/features/<FEATURE_NAME>/<FEATURE_NAME>.types.ts` (if it exists)
    -   `apps/web/src/features/<FEATURE_NAME>/<FEATURE_NAME>.query.ts`
2.  **Create API Directory:** Ensure `apps/api/src/features/<FEATURE_NAME>` exists.
3.  **Migrate Shared Files:**
    -   Move `service.ts`, `schema.ts`, and `types.ts` (if exists) from `apps/web/src/features/<FEATURE_NAME>` to `apps/api/src/features/<FEATURE_NAME>`.
    -   **Edit Service:** Update the moved `service.ts` to use `getDB()` from `~/context` for database access. Ensure service functions handle obtaining necessary context (like `userId`) internally if possible, adjusting signatures only if context must be passed explicitly.
    -   **Edit Schema:** Review the moved `schema.ts`. Ensure it contains schemas needed for router inputs/service layer. Remove purely UI-related schemas if they aren't used by the API.
4.  **Create tRPC Router:** Create `apps/api/src/features/<FEATURE_NAME>/<FEATURE_NAME>.router.ts`.
    -   Translate each `$originalName` from `.api.ts` into a tRPC procedure named `originalName` (`publicProcedure` or `protectedProcedure`).
    -   Use `.input()` with schemas from the migrated `schema.ts`, inline schemas (`z.object(...)`), or extended schemas.
    -   Call the corresponding service functions in the handlers, passing `input`. Access `ctx` only if necessary.
    -   Ensure return values match client expectations.
5.  **Update Main API Router:** Edit `apps/api/src/trpc/routers/index.ts` to import and include the new `<FEATURE_NAME>Router`.
6.  **Create Client Directory:** Ensure `apps/client/src/features/<FEATURE_NAME>` exists.
7.  **Create Client Query File:** Create `apps/client/src/features/<FEATURE_NAME>/<FEATURE_NAME>.query.ts`. Implement TanStack Query hooks using the tRPC integration:
    -   Pass `trpc.<feature>.<procedure>.queryOptions(...)` / `mutationOptions(...)` directly to `useQuery`/`useMutation`.
    -   Pass input/options arguments correctly as per the plan.
    -   Use correct procedure names (matching step 4) in hooks and for cache invalidation (`queryKey`).
8.  **(Information Only):** UI components will be updated manually later.
9.  **Propose Cleanup:** Propose deleting the original `.api.ts`, `.query.ts`, `.service.ts`, `.schema.ts`, and `.types.ts` files from `apps/web/src/features/<FEATURE_NAME>`.

Focus on the `<FEATURE_NAME>` feature for this request.
```
