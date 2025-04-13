import { createContext, useContext, useState, ReactNode } from 'react'

type ChatInputContextType = {
  inputHeight: number
  setInputHeight: (height: number) => void
}

const ChatInputContext = createContext<ChatInputContextType | undefined>(undefined)

// Provider component
export function ChatInputProvider({ children }: { children: ReactNode }) {
  const [inputHeight, setInputHeight] = useState<number>(100) // Default height

  return (
    <ChatInputContext.Provider value={{ inputHeight, setInputHeight }}>
      {children}
    </ChatInputContext.Provider>
  )
}

// Hook to use the context
export function useChatInput() {
  const context = useContext(ChatInputContext)
  if (context === undefined) {
    throw new Error('useChatInput must be used within a ChatInputProvider')
  }
  return context
}
