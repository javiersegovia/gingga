import type { VisibilityType } from './visibility-selector'
import { memo } from 'react'
import { VisibilitySelector } from './visibility-selector'

function PureChatHeader({
  chatId,
  selectedVisibilityType = 'private',
  isReadonly,
  hasMessages,
}: {
  isReadonly: boolean
  hasMessages: boolean
  chatId?: string | null
  selectedVisibilityType?: VisibilityType
}) {
  return (
    <header className="bg-background sticky top-0 z-10 flex items-center gap-2 px-2 py-1.5">
      {/* <SidebarToggle /> */}

      {/* {!isReadonly && (
        <ModelSelector
          selectedModelId={selectedModelId}
          className="order-1 md:order-2"
        />
      )} */}
      {/* <SidebarFloatingActions /> */}

      <div className="ml-auto flex items-center gap-2">
        {!isReadonly && hasMessages && chatId && (
          <VisibilitySelector
            chatId={chatId}
            selectedVisibilityType={selectedVisibilityType}
          />
        )}
        {/* <ThemeSwitch /> */}
      </div>
    </header>
  )
}

// export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
export const ChatHeader = memo(PureChatHeader, () => {
  // return prevProps.selectedModelId === nextProps.selectedModelId
  return true
})
