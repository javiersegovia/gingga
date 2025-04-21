import type { ReactNode } from 'react'
import { createContext, use, useMemo, useState } from 'react'

interface ChatInputContextType {
  inputHeight: number
  setInputHeight: (height: number) => void
}

const ChatInputContext = createContext<ChatInputContextType | undefined>(undefined)

// Provider component
export function ChatInputProvider({ children }: { children: ReactNode }) {
  const [inputHeight, setInputHeight] = useState<number>(100) // Default height

  const value = useMemo(() => ({ inputHeight, setInputHeight }), [inputHeight])

  return (
    <ChatInputContext value={value}>
      {children}
    </ChatInputContext>
  )
}

// Hook to use the context
export function useChatInput() {
  const context = use(ChatInputContext)
  if (context === undefined) {
    throw new Error('useChatInput must be used within a ChatInputProvider')
  }
  return context
}
