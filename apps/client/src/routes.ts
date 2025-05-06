import type { RouteConfig } from '@react-router/dev/routes'
import { index, layout, prefix, route } from '@react-router/dev/routes'

export const DASHBOARD_INDEX_PATH = '/agents' as const

export default [
  index('routes/home/index.tsx'),
  route('contact', 'routes/contact.tsx'),
  route('/api/trpc/*', 'routes/api/trpc.ts'),

  ...prefix('actions', [
    route('update-theme', 'routes/_actions/update-theme.ts'),
  ]),

  ...prefix('admin', [

    layout('routes/admin/_layout.tsx', [
      index('routes/admin/index.tsx'),
      route('users', 'routes/admin/users/index.tsx'),
      route('users/:userId', 'routes/admin/users/$userId.tsx'),

      ...prefix('n8n-workflows', [
        index('routes/admin/n8n-workflows/index.tsx'),
        route(':workflowId', 'routes/admin/n8n-workflows/$workflowId.tsx'),
      ]),
    ]),

  ]),

  layout('routes/_auth/_layout.tsx', [
    route('identify', 'routes/_auth/identify.tsx'),
    route('register', 'routes/_auth/register.tsx'),
    route('reset-password', 'routes/_auth/reset-password.tsx'),
    route('forgot-password', 'routes/_auth/forgot-password.tsx'),
  ]),

  layout('routes/_chat/_layout.tsx', [
    ...prefix(DASHBOARD_INDEX_PATH, [
      index('routes/_chat/agents/index.tsx'),
      route('create', 'routes/_chat/agents/create.tsx'),
      // route(':chatId', 'routes/chat/$chatId.tsx'),
      // Agents routes (flat under /chat/agents)
    ]),

    // ...prefix('/agents', [
    // route('create', 'routes/chat/agents/create.tsx'),
    // ]),

    ...prefix('/agent/:agentId', [
      index('routes/_chat/agent/$agentId/index.tsx'),
      // route(':agentId', 'routes/_chat/agent/$agentId/index.tsx'),
      route('/chat/:chatId', 'routes/_chat/agent/$agentId/chat/$chatId.tsx'),

      // Define the 'edit' path segment and associate the layout directly
      route('/edit', 'routes/_chat/agent/$agentId/edit/_layout.tsx', [
        // Child routes relative to the layout
        index('routes/_chat/agent/$agentId/edit/index.tsx'),
        route('skills', 'routes/_chat/agent/$agentId/edit/skills.tsx'),
        route('instructions', 'routes/_chat/agent/$agentId/edit/instructions.tsx'),
        route('knowledge', 'routes/_chat/agent/$agentId/edit/knowledge.tsx'),
        route('workflows', 'routes/_chat/agent/$agentId/edit/workflows.tsx'),
      ]),

      route('sessions', 'routes/_chat/agent/$agentId/sessions/index.tsx', [
        route(':sessionId', 'routes/_chat/agent/$agentId/sessions/$sessionId.tsx'),
      ]),

      // Placeholder for automations route
      route('automations', 'routes/_chat/agent/$agentId/automations/index.tsx'),
      route('leads', 'routes/_chat/agent/$agentId/leads/index.tsx'),
    ]),
  ]),

  route('/settings', 'routes/settings/_layout.tsx', [
    route('account', 'routes/settings/account.tsx'),
    route('integrations', 'routes/settings/integrations.tsx'),
    route('preferences', 'routes/settings/preferences.tsx'),
    route('contact', 'routes/settings/contact.tsx'),
  ]),

] satisfies RouteConfig
