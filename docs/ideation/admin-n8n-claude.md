# N8n Workflows Admin Panel Implementation Plan

## Overview

This document outlines the implementation plan for the N8n Workflows management feature within the admin panel. The feature will allow administrators to import, view, edit, and synchronize N8n workflows from the N8n API.

## User Stories

1. As an admin, I want to view a list of all imported workflows so I can manage them.
2. As an admin, I want to import a workflow from N8n by URL to integrate it with our system.
3. As an admin, I want to view and edit workflow details to maintain accurate metadata.
4. As an admin, I want to synchronize workflows with N8n to ensure they're up-to-date.

## Architecture

### Data Flow

```
┌─────────┐    ┌──────────────┐    ┌───────────┐    ┌───────────┐
│  Admin  │───►│ Gingga Admin │◄───┤ N8n Router│◄───┤N8n Service│
│   UI    │    │   Interface  │    │           │    │           │
└─────────┘    └──────────────┘    └───────────┘    └───────────┘
                                                          │
                                                          ▼
                                                    ┌───────────┐
                                                    │  N8n API  │
                                                    │           │
                                                    └───────────┘
                                                          │
                                                          ▼
┌─────────┐    ┌──────────────┐    ┌───────────┐     ┌───────────┐
│ Database│◄───┤ DB Operations│◄───┤N8n Service│◄───┤  N8n API  │
│         │    │              │    │           │    │  Response │
└─────────┘    └──────────────┘    └───────────┘     └───────────┘
```

### Components

1. **UI Components**:
   - `index.tsx`: List view with TanStack Table
   - `$workflowId.tsx`: Detail/edit view with form
   - `create.tsx`: Import workflow dialog

2. **Backend Components**:
   - `n8n.service.ts`: API interactions and business logic
   - `n8n.router.ts`: tRPC procedures and routing
   - `N8NWorkflows` (DB schema): Data storage

## Implementation Details

### 1. Workflows List Page (`index.tsx`)

- **UI Components**:
  - TanStack Table with pagination
  - Empty state message when no workflows
  - "Import Workflow" button at the top
  - Row actions including "Synchronize" button
  - Status indicator for each workflow

- **Data Requirements**:
  - Basic workflow metadata (name, description, status)
  - Last synchronized timestamp
  - Actions column for operations

- **Implementation References**:
  - Use existing user table components as reference:
    - `users-columns.tsx`
    - `users-data-table-column-header.tsx`
    - `users-data-table-pagination.tsx`
    - `users-data-table.tsx`
    - `users-data-table-row-actions.tsx`
    - `users-data-table-view-options.tsx`

### 2. Workflow Import Dialog (`create.tsx`)

- **UI Components**:
  - Modal dialog with form
  - URL input field
  - Import button
  - Loading/progress indicator

- **Data Requirements**:
  - N8n workflow URL or ID
  - Success/error feedback

- **Process Flow**:
  1. User enters N8n workflow URL
  2. System fetches workflow details from N8n API
  3. AI generates input/output schemas
  4. System creates record in the database
  5. Redirect to workflow detail page

### 3. Workflow Detail Page (`$workflowId.tsx`)

- **UI Components**:
  - TanStack Form for editing workflow details
  - Metadata display (ID, status, etc.)
  - "Synchronize" button at top right
  - Save/Cancel buttons for form

- **Data Requirements**:
  - All workflow fields from database
  - Input/output schemas
  - Webhook URL

- **Form Implementation**:
  - Follow patterns in `forms.mdc`
  - Use `useAppForm` hook
  - Include validation with Zod
  - Implement form submission handler

### 4. N8n Service Extensions (`n8n.service.ts`)

- **New Functions**:
  - `importWorkflow(url: string)`: 
    - Fetch workflow from N8n API
    - Generate schemas using AI
    - Create record in database
  
  - `synchronizeWorkflow(id: string)`:
    - Fetch latest workflow data from N8n
    - Update local database record
    - Regenerate schemas if needed

  - Additional helpers for AI schema generation

### 5. N8n Router Extensions (`n8n.router.ts`)

- **New Procedures**:
  - `importWorkflow`: Mutation to import workflow
  - `synchronizeWorkflow`: Mutation to sync workflow
  - Additional procedures as needed

## Database Schema

The implementation will use the existing `N8NWorkflows` table with potentially some minor additions:

```ts
// Existing fields from schema.ts
export const N8NWorkflows = sqliteTable('workflows', {
  id: nanoIdDefault().primaryKey(),
  ...timestamps,
  n8nWorkflowId: text('n8n_workflow_id').notNull().unique(),
  name: text('name'),
  description: text('description'),
  status: text('status', { enum: ['active', 'inactive', 'error'] }).default('inactive'),
  webhookUrl: text('webhook_url').notNull(),
  inputSchema: text('input_schema', { mode: 'json' }).$type<Record<string, any>>(),
  outputSchema: text('output_schema', { mode: 'json' }).$type<Record<string, any>>(),
});
```

## Form Implementation

Following the patterns in `forms.mdc`:

1. **Schema Definition** (`n8n.schema.ts`):
   - Define `WorkflowFormSchema` using Zod
   - Create form options with default values

2. **Form Component** (in `$workflowId.tsx`):
   - Use `useAppForm` hook
   - Implement fields with validation
   - Handle form submission

3. **Server Integration**:
   - Create server action for form submission
   - Use Tanstack Query for data fetching/mutations

## Potential Challenges & Solutions

1. **AI Schema Generation**:
   - **Challenge**: Accurately generating input/output schemas from N8n workflow definitions
   - **Solution**: Start with basic schema detection for common patterns, refine with user feedback

2. **N8n API Rate Limits**:
   - **Challenge**: Potential rate limiting when synchronizing multiple workflows
   - **Solution**: Implement request throttling and queueing

3. **Webhook URL Management**:
   - **Challenge**: Ensuring webhook URLs remain valid after N8n service restarts
   - **Solution**: Implement validation checks during synchronization

4. **Large Workflows**:
   - **Challenge**: Performance issues with very large or complex workflows
   - **Solution**: Implement pagination and lazy loading of detailed information

## Future Enhancements

1. **Workflow Testing**: Add ability to test workflows with sample data
2. **Execution History**: Display execution history and statistics
3. **Visual Designer**: Basic visual representation of the workflow
4. **Credentials Management**: Manage N8n credentials within the admin panel
5. **Variables Management**: Configure environment variables for workflows

## Implementation Timeline

1. **Phase 1**: Basic list view and workflow detail pages
2. **Phase 2**: Import functionality with AI schema generation
3. **Phase 3**: Synchronization features
4. **Phase 4**: Enhanced UI and usability improvements

## Conclusion

This implementation will provide administrators with a comprehensive interface to manage N8n workflows within the system. By leveraging the N8n API and incorporating AI-driven schema generation, we can create a powerful yet user-friendly workflow management experience.
