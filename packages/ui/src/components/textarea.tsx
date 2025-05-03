import { cn } from '@gingga/ui/lib/utils'

import * as React from 'react'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input bg-blank ring-offset-background placeholder:text-muted-foreground aria-invalid:border-destructive focus-visible:ring-brand-sky flex min-h-[80px] w-full rounded-sm border px-3 py-2 text-sm focus-visible:ring-4 focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
