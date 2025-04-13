import { Button } from '@gingga/ui/components/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@gingga/ui/components/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gingga/ui/components/form'
import { Input } from '@gingga/ui/components/input'
import { Switch } from '@gingga/ui/components/switch'

import { z } from 'zod'
import { Label } from '@gingga/ui/components/label'
import { CopyIcon, CheckIcon } from 'lucide-react'
import { useState } from 'react'
import { useUpdateChatVisibilityMutation } from '@/features/chat/chat.query'
import { Chat } from '@/db/types'

export function ShareChatDialog({
  chat,
}: {
  chat: Pick<Chat, 'id' | 'title' | 'visibility'>
}) {
  const [copied, setCopied] = useState(false)
  const [isPublic, setIsPublic] = useState(chat.visibility === 'public')
  const { mutateAsync, isPending } = useUpdateChatVisibilityMutation()

  const handleCopy = async () => {
    const url = `${window.location.origin}/chat/${chat.id}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 5000)
  }

  const handleVisibilityChange = async (checked: boolean) => {
    setIsPublic(checked)
    await mutateAsync({
      data: {
        id: chat.id,
        visibility: checked ? 'public' : 'private',
      },
    })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sharing</DialogTitle>
        <DialogDescription>
          {isPublic
            ? 'This chat is public. Anyone with the link can view it.'
            : 'This chat is private. Only you can view it.'}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="flex items-center space-x-0">
          <Switch
            id="visibility"
            checked={isPublic}
            onCheckedChange={handleVisibilityChange}
            disabled={isPending}
          />
          <Label htmlFor="visibility" className="cursor-pointer">
            {isPublic ? 'Public' : 'Private'}
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={handleCopy} type="button" hover="reverse" disabled={!isPublic}>
            <span className="">
              {copied ? 'Copied to clipboard' : 'Copy link to clipboard'}
            </span>
            {copied ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" hover="reverse">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}
