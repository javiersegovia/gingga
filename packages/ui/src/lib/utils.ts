import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { createContext, use } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

/**
 * Creates a React Context with a custom `useContext` hook.
 *
 * @param options - Options for the context.
 * @param options.defaultValue - Default context value, or `null`.
 * @param options.errorMessage - Error message if `useContext` is called outside a provider.
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
    const contextValue = use(context)
    if (contextValue === null) {
      throw new Error(opts.errorMessage)
    }
    return contextValue
  }

  return [context.Provider, useContextFactory] as const
}
