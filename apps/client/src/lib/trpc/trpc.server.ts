// TODO: Solve this! We need to check how to create the caller for the server
// _______________________________________________________________________

// import type { LoaderFunctionArgs } from 'react-router'
// import { createCallerFactory } from '@gingga/api/trpc/index'
// import { appRouter } from '@gingga/api/trpc/routers/index'

// function createContext(opts: { headers: Headers }) {
//   const headers = new Headers(opts.headers)
//   headers.set('x-trpc-source', 'server-loader')
//   return createTRPCContext({
//     headers,
//   })
// }

// const createCaller = createCallerFactory(appRouter)
// export async function caller(loaderArgs: LoaderFunctionArgs) {
//   return createCaller(await createContext({ headers: loaderArgs.request.headers }))
// }
