import type { Chat } from '@gingga/db/types'
import type { z } from 'zod'
import { RenameChatSchema } from '@gingga/api/features/chat/chat.schema'
import { Button } from '@gingga/ui/components/button'
import {
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
  FormMessage,
} from '@gingga/ui/components/form'
import { Input } from '@gingga/ui/components/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRenameChatMutation } from '~/features/chat/chat.query'

type RenameFormValues = z.infer<typeof RenameChatSchema>

export function RenameChatDialog({
  chat,
  closeDialog,
}: {
  closeDialog: () => void
  chat: Pick<Chat, 'id' | 'title'>
}) {
  const { mutateAsync, isPending } = useRenameChatMutation()

  const form = useForm<RenameFormValues>({
    resolver: zodResolver(RenameChatSchema),
    defaultValues: {
      id: chat.id,
      title: chat.title ?? '',
    },
  })

  async function onSubmit(data: RenameFormValues) {
    await mutateAsync(
      {
        id: chat.id,
        title: data.title,
      },
      {
        onSuccess: async () => {
          closeDialog()
        },
      },
    )
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Rename chat</DialogTitle>
            <DialogDescription>Give your chat a meaningful title.</DialogDescription>
          </DialogHeader>

          <FormField
            control={form.control}
            name="title"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Chat title</FormLabel> */}
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={isPending} variant="secondary">
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
