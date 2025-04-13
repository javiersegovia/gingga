import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { useContext } from 'react'
import { createContext } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

/**
 * Creates a React Context with a custom `useContext` hook.
 *
 * @param defaultValue - Default context value, or `null`.
 * @param errorMessage - Error message if `useContext` is called outside a provider.
 * @returns A tuple with the Provider and custom `useContext` hook.
 */
export function createContextFactory<ContextData>(options?: {
  defaultValue?: ContextData | null
  errorMessage?: string
}) {
  const opts = {
    defaultValue: null,
    errorMessage: 'useContext must be used within a Provider',
    ...options,
  }

  const context = createContext<ContextData | null>(opts.defaultValue)

  function useContextFactory(): ContextData {
    const contextValue = useContext(context)
    if (contextValue === null) {
      throw new Error(opts.errorMessage)
    }
    return contextValue
  }

  return [context.Provider, useContextFactory] as const
}