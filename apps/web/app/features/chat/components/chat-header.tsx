import { memo } from 'react'
import { VisibilityType, VisibilitySelector } from './visibility-selector'

function PureChatHeader({
  chatId,
  // selectedModelId,
  selectedVisibilityType,
  isReadonly,
  hasMessages,
}: {
  chatId: string
  // selectedModelId: string
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
  hasMessages: boolean
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
        {!isReadonly && hasMessages && (
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

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  // return prevProps.selectedModelId === nextProps.selectedModelId
  return true
})
