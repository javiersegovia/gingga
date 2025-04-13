import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva } from 'class-variance-authority'

import { cn } from '@gingga/ui/lib/utils'

const labelVariants = cva(
  'text-sm text-foreground font-medium ml-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(labelVariants(), className)}
      {...props}
    />
  )
}

export { Label }
