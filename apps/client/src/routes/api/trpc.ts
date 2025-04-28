import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '~/server/trpc/routers/app.router'

export async function loader(args: LoaderFunctionArgs) {
  return handleRequest(args)
}

export async function action(args: ActionFunctionArgs) {
  return handleRequest(args)
}

function handleRequest(args: LoaderFunctionArgs | ActionFunctionArgs) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: args.request,
    router: appRouter,
  })
}
