import type { UseChatHelpers } from '@ai-sdk/react'
import type { Message } from 'ai'
import type { Dispatch, SetStateAction } from 'react'
// import { $deleteTrailingMessages } from '~/features/chat/chat.api'
import { Button } from '@gingga/ui/components/button'
import { Textarea } from '@gingga/ui/components/textarea'
import { useEffect, useRef, useState } from 'react'

export interface MessageEditorProps {
  message: Message
  setMode: Dispatch<SetStateAction<'view' | 'edit'>>
  setMessages: UseChatHelpers['setMessages']
  reload: UseChatHelpers['reload']
}

export function MessageEditor({
  message,
  setMode,
  setMessages,
  reload,
}: MessageEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [draftContent, setDraftContent] = useState<string>(
    message.parts?.find(part => part.type === 'text')?.text || '',
  )
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight()
    }
  }, [])

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftContent(event.target.value)
    adjustHeight()
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <Textarea
        data-testid="message-editor"
        ref={textareaRef}
        className="w-full resize-none overflow-hidden bg-transparent !text-base outline-none"
        value={draftContent}
        onChange={handleInput}
      />

      <div className="flex flex-row justify-end gap-2">
        <Button
          variant="outline"
          className="h-fit px-3 py-2"
          onClick={() => {
            setMode('view')
          }}
        >
          Cancel
        </Button>
        <Button
          data-testid="message-editor-send-button"
          variant="primary"
          className="h-fit px-3 py-2"
          disabled={isSubmitting}
          onClick={async () => {
            setIsSubmitting(true)

            // alert('Not implemented')
            // await $deleteTrailingMessages({
            //   data: { id: message.id },
            // })

            // @ts-expect-error todo: support UIMessage in setMessages
            setMessages((messages) => {
              const index = messages.findIndex(m => m.id === message.id)

              if (index !== -1) {
                const updatedMessage = {
                  ...message,
                  content: draftContent,
                  parts: [{ type: 'text', text: draftContent }],
                }

                return [...messages.slice(0, index), updatedMessage]
              }

              return messages
            })

            setMode('view')
            reload()
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  )
}
