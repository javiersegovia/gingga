import type { DehydratedState } from '@tanstack/react-query'
import merge from 'deepmerge'
import { useMatches } from 'react-router'

export function useDehydratedState(): DehydratedState | undefined {
  const matches = useMatches()

  const dehydratedState = matches
    .map((match) => {
      // eslint-disable-next-line ts/no-explicit-any
      return (match.data as any)?.dehydratedState
    })
    .filter(Boolean)

  return dehydratedState.length
    ? dehydratedState.reduce((accumulator, currentValue) => merge(accumulator, currentValue), {})
    : undefined
}
