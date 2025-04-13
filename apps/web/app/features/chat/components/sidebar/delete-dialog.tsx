import { Button } from '@gingga/ui/components/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@gingga/ui/components/dialog'
import { useDeleteChatMutation } from '@/features/chat/chat.query'
import { Chat } from '@/db/types'

export function DeleteChatDialog({
  chat,
  closeDialog,
}: {
  chat: Pick<Chat, 'id' | 'title'>
  closeDialog: () => void
}) {
  const { mutateAsync, isPending } = useDeleteChatMutation()
  // const router = useRouter()

  const handleDelete = async () => {
    await mutateAsync(
      {
        data: { id: chat.id },
      },
      // {
      //   onSuccess: async () => {
      //     await router.invalidate()
      //     closeDialog()
      //     // router.navigate({  })
      //   },
      // },
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete chat</DialogTitle>
        <DialogDescription className="pt-4">
          This action cannot be undone. Are you sure you want to permanently delete this
          chat?
          <span className="mt-4 block rounded-md border border-dashed border-red-500 p-2 text-red-500/70 dark:border-red-500">
            {chat.title}
          </span>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="ghost" disabled={isPending}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          onClick={async () => {
            await handleDelete()
            closeDialog()
          }}
          variant="destructive"
          disabled={isPending}
        >
          {isPending ? 'Deleting...' : 'Delete chat'}
        </Button>
      </DialogFooter>
    </>
  )
}
