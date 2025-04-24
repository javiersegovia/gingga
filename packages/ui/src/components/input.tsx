import { cn } from '@gingga/ui/lib/utils'

import * as React from 'react'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        'border-input bg-blank ring-offset-background file:text-foreground placeholder:text-muted-foreground aria-invalid:border-destructive focus-visible:ring-brand-sky flex h-10 w-full rounded-sm border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-4 focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
// focus-visible:ring-[#1ca6f9]
