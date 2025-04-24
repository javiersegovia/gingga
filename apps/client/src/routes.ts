import type { RouteConfig } from '@react-router/dev/routes'
import { index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  index('routes/home/index.tsx'),
  route('test', 'routes/test.tsx'),

  layout('routes/_auth/_layout.tsx', [
    route('identify', 'routes/_auth/identify.tsx'),
    route('register', 'routes/_auth/register.tsx'),
    route('reset-password', 'routes/_auth/reset-password.tsx'),
    route('forgot-password', 'routes/_auth/forgot-password.tsx'),
  ]),

  ...prefix('/chat', [
    layout('routes/chat/_layout.tsx', [
      index('routes/chat/index.tsx'),
    ]),
  ]),

] satisfies RouteConfig
