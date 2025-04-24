import type { ClientEnv } from '~/lib/env.server'
import { useRouteLoaderData } from 'react-router'

export function useClientEnv() {
  const data = useRouteLoaderData<{ ENV: ClientEnv }>('root')

  if (!data) {
    throw new Error('No data found. Make sure to setup the ClientEnv in the root loader.')
  }

  return data.ENV
}
