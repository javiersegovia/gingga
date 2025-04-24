import { createRequestHandler } from 'react-router'
import { CloudflareContext } from '~/middleware/cloudflare.server'

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

export default {
  fetch(request, env, ctx) {
    const context = new Map([[CloudflareContext, { env, ctx }]])
    return requestHandler(request, context)
  },
} satisfies ExportedHandler<Env>
