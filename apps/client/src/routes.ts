import type { RouteConfig } from '@react-router/dev/routes'
import { index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  index('routes/home/index.tsx'),
  route('contact', 'routes/contact.tsx'),
  route('/api/trpc/*', 'routes/api/trpc.ts'),

  ...prefix('actions', [
    route('update-theme', 'routes/_actions/update-theme.ts'),
  ]),

  layout('routes/_auth/_layout.tsx', [
    route('identify', 'routes/_auth/identify.tsx'),
    route('register', 'routes/_auth/register.tsx'),
    route('reset-password', 'routes/_auth/reset-password.tsx'),
    route('forgot-password', 'routes/_auth/forgot-password.tsx'),
  ]),

  ...prefix('/chat', [

    layout('routes/chat/_layout.tsx', [
      index('routes/chat/index.tsx'),
      route(':chatId', 'routes/chat/$chatId.tsx'),
      // Agents routes (flat under /chat/agents)

      ...prefix('/agents', [
        index('routes/chat/agents/index.tsx'),
        route('create', 'routes/chat/agents/create.tsx'),
      ]),

      ...prefix('/agent', [
        route(':agentId', 'routes/chat/agent/$agentId/index.tsx'),
        route(':agentId/chat/:chatId', 'routes/chat/agent/$agentId/chat/$chatId.tsx'),

        // Index is handled above

        // Define the 'edit' path segment and associate the layout directly
        route(':agentId/edit', 'routes/chat/agent/$agentId/edit/_layout.tsx', [
          // Child routes relative to the layout
          index('routes/chat/agent/$agentId/edit/index.tsx'),
          route('skills', 'routes/chat/agent/$agentId/edit/skills.tsx'),
          route('instructions', 'routes/chat/agent/$agentId/edit/instructions.tsx'),
          route('knowledge', 'routes/chat/agent/$agentId/edit/knowledge.tsx'),
          route('workflows', 'routes/chat/agent/$agentId/edit/workflows.tsx'),
        ]),

      ]),
    ]),
  ]),

  route('/settings', 'routes/settings/_layout.tsx', [
    route('account', 'routes/settings/account.tsx'),
    route('integrations', 'routes/settings/integrations.tsx'),
    route('preferences', 'routes/settings/preferences.tsx'),
    route('contact', 'routes/settings/contact.tsx'),
  ]),

] satisfies RouteConfig
