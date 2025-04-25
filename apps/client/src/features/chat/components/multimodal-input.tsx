import type { UseChatHelpers } from '@ai-sdk/react'
import type { Attachment, Message } from 'ai'
import type React from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { Button } from '@gingga/ui/components/button'

import { Textarea } from '@gingga/ui/components/textarea'
import { cn } from '@gingga/ui/lib/utils'
import equal from 'fast-deep-equal'
import { ArrowUpIcon } from 'lucide-react'
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useLocalStorage, useWindowSize } from 'usehooks-ts'
import { useChatInput } from './chat-input-context'
import { PreviewAttachment } from './messages/message-preview-attachment'

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void
  setMessages: Dispatch<SetStateAction<Array<Message>>>
}) {
  return (
    <Button
      data-testid="stop-button"
      className="dark:border-border border p-1.5"
      onClick={(event) => {
        event.preventDefault()
        stop()
        setMessages(messages => messages)
      }}
    >
      <StopIcon size={14} />
      <span className="">Stop!</span>
    </Button>
  )
}

const StopButton = memo(PureStopButton)

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
}: {
  submitForm: () => void
  input: string
  uploadQueue: Array<string>
}) {
  return (
    <Button
      data-testid="send-button"
      variant="primary"
      className="h-fit rounded-full p-1.5"
      onClick={(event) => {
        event.preventDefault()
        submitForm()
      }}
      disabled={input.length === 0 || uploadQueue.length > 0}
    >
      <ArrowUpIcon size={14} />
    </Button>
  )
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false
  if (prevProps.input !== nextProps.input)
    return false
  return true
})

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  status,
  stop,
  attachments,
  setAttachments,
  // messages,
  setMessages,
  // append,
  handleSubmit,
  className,
  disabled,
  hasPendingToolCallConfirmation,
}: {
  chatId: string
  input: UseChatHelpers['input']
  setInput: UseChatHelpers['setInput']
  status: UseChatHelpers['status']
  stop: () => void
  attachments: Array<Attachment>
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>
  messages: Array<Message>
  setMessages: Dispatch<SetStateAction<Array<Message>>>
  append: UseChatHelpers['append']
  handleSubmit: UseChatHelpers['handleSubmit']
  className?: string
  disabled?: boolean
  hasPendingToolCallConfirmation?: boolean
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const { width } = useWindowSize()
  const { setInputHeight } = useChatInput()

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

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = '98px'
    }
  }

  const [localStorageInput, setLocalStorageInput] = useLocalStorage('input', '')

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || ''
      setInput(finalValue)
      adjustHeight()
    }
    // Only run once after hydration
  }, [])

  useEffect(() => {
    setLocalStorageInput(input)
  }, [input, setLocalStorageInput])

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    adjustHeight()
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadQueue, _setUploadQueue] = useState<Array<string>>([])

  // Update input height in context whenever it changes
  useLayoutEffect(() => {
    if (inputContainerRef.current) {
      const height = inputContainerRef.current.offsetHeight
      setInputHeight(height)
    }
  }, [input, attachments, uploadQueue, setInputHeight])

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
    })

    setAttachments([])
    setLocalStorageInput('')
    resetHeight()

    if (width && width > 768) {
      textareaRef.current?.focus()
    }
  }, [attachments, handleSubmit, setAttachments, setLocalStorageInput, width, chatId])

  // const uploadFile = async (file: File) => {
  //   const formData = new FormData()
  //   formData.append('file', file)

  //   try {
  //     const response = await fetch('/api/files/upload', {
  //       method: 'POST',
  //       body: formData,
  //     })

  //     if (response.ok) {
  //       const data = await response.json()
  //       const { url, pathname, contentType } = data

  //       return {
  //         url,
  //         name: pathname,
  //         contentType: contentType,
  //       }
  //     }
  //     const { error } = await response.json()
  //     toast({
  //       title: 'Error',
  //       description: error,
  //       variant: 'destructive',
  //     })
  //   } catch (error) {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to upload file, please try again!',
  //       variant: 'destructive',
  //     })
  //   }
  // }

  // const handleFileChange = useCallback(
  //   async (event: ChangeEvent<HTMLInputElement>) => {
  //     const files = Array.from(event.target.files || [])

  //     setUploadQueue(files.map((file) => file.name))

  //     try {
  //       const uploadPromises = files.map((file) => uploadFile(file))
  //       const uploadedAttachments = await Promise.all(uploadPromises)
  //       const successfullyUploadedAttachments = uploadedAttachments.filter(
  //         (attachment) => attachment !== undefined,
  //       )

  //       setAttachments((currentAttachments) => [
  //         ...currentAttachments,
  //         ...successfullyUploadedAttachments,
  //       ])
  //     } catch (error) {
  //       console.error('Error uploading files!', error)
  //     } finally {
  //       setUploadQueue([])
  //     }
  //   },
  //   [setAttachments],
  // )

  return (
    <section className="relative z-10 mx-auto w-full md:max-w-3xl">
      <div className="relative flex justify-center p-4 sm:justify-end">
        {/* <ScrollButton
          messagesEndRef={messagesEndRef}
          messagesContainerRef={messagesContainerRef}
          aria-label="Scroll to bottom"
        /> */}
      </div>

      {/* TODO: add suggestions on how to continue the conversation */}
      <div
        ref={inputContainerRef}
        style={
          {
            '--lightFocusColor': 'rgb(from var(--brand-blue) r g b / .2)',
            '--darkFocusColor': 'rgb(from #fff r g b / .2)',
          } as React.CSSProperties
        }
        className={cn(
          'bg-blank rounded-base border-border pointer-events-auto relative flex w-full flex-col gap-0 overflow-hidden rounded-br-none rounded-bl-none border-x-2 border-t-2 transition-colors duration-200',
          // 'ring-blue-500 has-[&:focus-visible]:ring-2',
          // '--focusColor:red',
          // 'has-[&:focus-visible]:border-border has-[&:focus-visible]:shadow-[0px_0px_2px_var(--lightFocusColor),_0px_0px_14px_var(--lightFocusColor)]',

          'has-[&:focus-visible]:border-brand-blue/50',
          'has-[&:focus-visible]:shadow-[0px_0px_8px_var(--lightFocusColor),_0px_0px_2px_var(--lightFocusColor)]',

          'dark:has-[&:focus-visible]:shadow-[0px_0px_8px_var(--darkFocusColor),_0px_0px_2px_var(--darkFocusColor)]',
          'dark:has-[&:focus-visible]:border-white/60',

          (disabled || hasPendingToolCallConfirmation) && 'bg-white/10',
          // isFocused && 'ring-border ring-offset-secondary ring-1 ring-offset-6',
        )}
      >
        <input
          type="file"
          className="pointer-events-none fixed -top-4 -left-4 size-0.5 opacity-0"
          ref={fileInputRef}
          multiple
          // onChange={handleFileChange}
          tabIndex={-1}
          disabled={disabled || hasPendingToolCallConfirmation}
        />

        {(attachments.length > 0 || uploadQueue.length > 0) && (
          <div
            data-testid="attachments-preview"
            className="flex flex-row items-end gap-2 overflow-x-scroll"
          >
            {attachments.map(attachment => (
              <PreviewAttachment key={attachment.url} attachment={attachment} />
            ))}

            {uploadQueue.map(filename => (
              <PreviewAttachment
                key={filename}
                attachment={{
                  url: '',
                  name: filename,
                  contentType: '',
                }}
                isUploading={true}
              />
            ))}
          </div>
        )}

        <Textarea
          data-testid="multimodal-input"
          ref={textareaRef}
          placeholder={
            disabled || hasPendingToolCallConfirmation
              ? 'Please approve or deny the action before using the chat again...'
              : 'Send a message...'
          }
          value={input}
          onChange={handleInput}
          disabled={disabled || hasPendingToolCallConfirmation}
          className={cn(
            'max-h-[308px] min-h-[24px] resize-none overflow-y-auto border-transparent bg-transparent p-4 ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0',
            className,
          )}
          rows={2}
          autoFocus
          onKeyDown={(event) => {
            if (
              event.key === 'Enter'
              && !event.shiftKey
              && !event.nativeEvent.isComposing
            ) {
              event.preventDefault()

              if (status !== 'error' && status !== 'ready') {
                toast.error('Please wait for the model to finish its response!')
              }
              else {
                submitForm()
              }
            }
          }}
        />

        <div className="flex items-center justify-end gap-2 p-2">
          {/* <div className="ml-auto flex w-fit flex-row justify-start">
            <AttachmentsButton fileInputRef={fileInputRef} status={status} />
          </div> */}
          <div className="flex w-fit flex-row justify-end">
            {status === 'submitted' || status === 'streaming'
              ? (
                  <StopButton stop={stop} setMessages={setMessages} />
                )
              : (
                  <SendButton
                    input={input}
                    submitForm={submitForm}
                    uploadQueue={uploadQueue}
                  />
                )}
          </div>
        </div>
      </div>
    </section>
  )
}

export const MultimodalInput = memo(PureMultimodalInput, (prevProps, nextProps) => {
  if (!equal(prevProps.messages, nextProps.messages))
    return false
  if (prevProps.input !== nextProps.input)
    return false
  if (prevProps.status !== nextProps.status)
    return false
  if (!equal(prevProps.attachments, nextProps.attachments))
    return false

  return true
})

// function PureAttachmentsButton({
//   fileInputRef,
//   status,
// }: {
//   fileInputRef: React.RefObject<HTMLInputElement>
//   status: UseChatHelpers['status']
// }) {
//   return (
//     <Button
//       data-testid="attachments-button"
//       hover="reverse"
//       className="hover:bg-primary-accent h-fit w-fit rounded-full p-1.5"
//       onClick={(event) => {
//         event.preventDefault()
//         fileInputRef.current?.click()
//       }}
//       disabled={status !== 'ready'}
//       variant="ghost"
//     >
//       <PaperclipIcon size={14} />
//     </Button>
//   )
// }

// const AttachmentsButton = memo(PureAttachmentsButton)

export function StopIcon({ size = 16 }: { size?: number }) {
  return (
    <svg height={size} viewBox="0 0 16 16" width={size} style={{ color: 'currentcolor' }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 3H13V13H3V3Z"
        fill="currentColor"
      />
    </svg>
  )
}
