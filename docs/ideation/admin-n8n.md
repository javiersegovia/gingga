# RFC-Style Documentation Plan for Admin n8n-Workflows Feature

---

## 1. Affected Components/Files

- `apps/client/src/routes/admin/n8n-workflows/index.tsx`
  (Workflows list/table, Import Workflow button/dialog, Synchronize button)
- `apps/client/src/routes/admin/n8n-workflows/create.tsx`
  (Optional: for future manual creation, not in current scope)
- `apps/client/src/routes/admin/n8n-workflows/$workflowId.tsx`
  (Workflow details/edit form, Synchronize button, Link to n8n)
- `apps/client/src/features/workflows/n8n.service.ts`
  (Update: `listWorkflows` to filter imported; Add: `importWorkflow`, `synchronizeWorkflow`)
- `apps/client/src/features/workflows/n8n.router.ts`
  (Update: `list` procedure logic; Add: `importWorkflow` and `synchronizeWorkflow` procedures)
- `packages/db/schema.ts`
  (Add: `lastSyncAt` to `N8NWorkflows` table - *already done*)
- Table UI reference files:
  - `apps/client/src/features/admin/users/components/users-columns.tsx`
  - `apps/client/src/features/admin/users/components/users-data-table.tsx`
  - `apps/client/src/features/admin/users/components/users-data-table-pagination.tsx`
  - `apps/client/src/features/admin/users/components/users-data-table-view-options.tsx`
  - `apps/client/src/features/admin/users/components/users-data-table-row-actions.tsx`
- Form utility:
  - `@tanstack-form.tsx` (location TBD, likely in `features/forms/` or `components/form/`)
- Documentation:
  - `docs/ideation/admin-n8n.md` (this file)

---

## 2. Data Flow Diagram (Mental Model)

```mermaid
flowchart TD
  subgraph UI
    A1[List Workflows (index.tsx)]
    A2[Import Workflow Dialog]
    A3[Workflow Details/Edit ($workflowId.tsx)]
    A4[Synchronize Button]
    A5[Link to n8n Workflow]
  end

  subgraph API
    B1[listWorkflows (n8n API & DB Filter)]
    B2[importWorkflow (n8n API & DB Insert)]
    B3[synchronizeWorkflow (n8n API & DB Update)]
    B4[getWorkflowDetails (DB)]
    B5[updateWorkflow (DB)]
  end

  subgraph DB
    C1[N8NWorkflows Table]
  end

  subgraph External
    D1[n8n API]
  end

  A1 -- fetch --> B4 -- query --> C1
  A2 -- open --> B1 -- query n8n --> D1
  B1 -- query db --> C1
  A2 -- select workflow --> B2 -- fetch from --> D1
  B2 -- AI schema gen, insert --> C1
  A3 -- fetch details --> B4 -- query --> C1
  A3 -- edit form submit --> B5 -- update --> C1
  A4 -- click --> B3 -- fetch latest from --> D1
  B3 -- update --> C1
  A1 -- click synchronize --> B3 -- update --> C1
  A5 -- click --> D1
```

---

## 3. Feature Requirements & Implementation Notes

### 3.1. Workflows List (`index.tsx`)
- Display all imported workflows from `N8NWorkflows` table using TanStack Table.
- If empty, show a friendly box explaining "No workflows imported yet. Use the Import Workflow button to get started."
- At the top:
  - `Import Workflow` button (opens dialog).
- Each row:
  - Workflow name, status, last sync time, actions (view/edit, synchronize, delete, link to n8n).
  - Row actions should be similar to `users-data-table-row-actions.tsx`.
  - Include a link icon that opens the workflow in n8n (e.g., `https://<your-n8n-instance>/workflow/<n8nWorkflowId>`).
- Table features:
  - Filtering, sorting, pagination, column visibility (see users table references).

### 3.2. Import Workflow Dialog
- Button opens a dialog/modal.
- Fetch list of available workflows from n8n API using `listWorkflows` service.
- Filter out workflows already present in the `N8NWorkflows` table (check by `n8nWorkflowId`).
- Display the remaining available workflows in a selectable list (e.g., dropdown or list with search).
- On selection and submit:
  - Call `importWorkflow` procedure with the selected `n8nWorkflowId`.
  - Service fetches specific workflow details from n8n API, uses AI to generate input/output schemas, saves to DB.
  - On success, close the dialog and refresh the workflows list in `index.tsx`. Consider navigating to the new workflow's detail page (`/$workflowId`).
- Error handling: show errors in dialog.

### 3.3. Workflow Details/Edit (`$workflowId.tsx`)
- Fetch workflow details by internal ID from the DB.
- Display a form (TanStack Form, see @forms.mdc) to edit workflow fields stored in our DB (name, description). Schemas might be displayed but potentially read-only initially, or have a dedicated "Regenerate Schema" button.
- At the top right:
  - `Synchronize` button (updates workflow info from n8n).
  - `Open in n8n` link/button (opens `https://<your-n8n-instance>/workflow/<n8nWorkflowId>`).
- On save: update workflow fields in DB.

### 3.4. Synchronize Workflow
- Available both in the workflow details page and in the table row actions.
- Calls `synchronizeWorkflow` procedure:
  - Fetches latest workflow info from n8n using `n8nWorkflowId`.
  - Updates DB record (name, description, status, webhook URL, `lastSyncAt`). Optionally re-generates schemas.
  - Shows success/error feedback.

### 3.5. Backend Service/Router (`n8n.service.ts`, `n8n.router.ts`)
- `listWorkflows()` (Update):
  - Fetch *all* workflows from n8n API (`/workflows` endpoint).
  - Fetch all imported `n8nWorkflowId`s from our DB.
  - Return the list of n8n workflows *not* present in our DB.
- `importWorkflow(n8nWorkflowId: string)`:
  - Fetch specific workflow details from n8n API (`/workflows/{id}` endpoint). [Ref: https://docs.n8n.io/api/api-reference/#tag/Workflow/paths/~1workflows~1%7Bid%7D/get]
  - Use AI (e.g., OpenAI, Claude) to analyze workflow structure and generate input/output JSON schemas.
  - Extract webhook URL if a webhook node exists.
  - Save new workflow to `N8NWorkflows` table (name, description, n8nWorkflowId, status, webhookUrl, generated schemas, `lastSyncAt`).
  - Return new workflow object or ID.
- `synchronizeWorkflow(id: string)`:
  - Get the `n8nWorkflowId` from our DB using the internal `id`.
  - Fetch latest workflow info from n8n API (`/workflows/{n8nWorkflowId}`).
  - Update DB record (name, description, status, webhookUrl, `lastSyncAt`). Optionally re-generate schemas.
  - Return updated workflow object.
- Add/Update corresponding procedures in `n8n.router.ts` (protected).

---

## 4. Potential Breaking Changes

- Modifying the existing `listWorkflows` service/procedure signature or return type if it's used elsewhere. (It currently only fetches from n8n API, adding DB filtering changes its purpose slightly for this context).
- Ensure API keys and base URLs are correctly configured in environment variables.

---

## 5. Alternative Approaches Considered

- Manual schema entry instead of AI generation (less user-friendly, more error-prone).
- Manually entering the n8n workflow ID/URL instead of listing available ones (more error-prone for users, requires copy-pasting).

---

## 6. Additional Suggestions & Improvements

- Add workflow tags/labels for better organization (requires DB schema change).
- Allow bulk synchronization and deletion.
- Add confirmation dialogs for destructive actions (delete).
- Consider showing workflow execution history or logs (requires additional n8n API calls and potentially DB storage).
- Implement robust loading and error states for all async actions (fetching list, importing, synchronizing, saving).
- Ensure accessibility and keyboard navigation for dialogs, lists, and tables.
- Use optimistic UI updates where appropriate (e.g., showing a workflow as "syncing" immediately).
- Add a search/filter bar to the "Import Workflow" dialog if the list of available workflows is long.
- Consider adding a "Test Webhook" button in the workflow details page.

---

## 7. Potential Issues

- n8n API rate limits or downtime could affect import/sync reliability. Add appropriate error handling and retry logic.
- AI schema generation may fail or produce incorrect results; clearly indicate generated schemas and allow manual editing/override in the details page form.
- Handling of workflow versioning/updates if n8n workflows change structure significantly between syncs.
- Security: Ensure proper authentication/authorization for all admin routes and API calls. Validate n8n API responses.
- Performance: Fetching all n8n workflows might be slow if there are hundreds/thousands. Consider pagination if the n8n API supports it for the `/workflows` list endpoint.
- AI cost: Schema generation via external AI APIs incurs costs.

---

## 8. Referenced Sections

- [features.mdc] (feature folder structure, router/service/component conventions)
- [forms.mdc] (form handling, validation, TanStack Form usage)
- [instructions.mdc] (general project standards, code style, UI/UX, error/loading states)
- [users-data-table*.tsx] (TanStack Table usage, pagination, filtering, row actions)
- [n8n.service.ts] (API integration, error handling, schema generation)
- [n8n.router.ts] (tRPC router/procedure patterns)
- [schema.ts] (N8NWorkflows table structure)
- [n8n API Docs - Get Workflow](https://docs.n8n.io/api/api-reference/#tag/Workflow/paths/~1workflows~1%7Bid%7D/get)
- [n8n API Docs - List Workflows](https://docs.n8n.io/api/api-reference/#tag/Workflow/paths/~1workflows/get) (Implied usage for listing)

---

**End of documentation plan.**
