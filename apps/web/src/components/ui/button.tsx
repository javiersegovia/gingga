import type { VariantProps } from 'class-variance-authority'
import * as Slot from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { Loader2Icon } from 'lucide-react'

import * as React from 'react'
import { cn } from '~/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center border cursor-pointer font-medium justify-center whitespace-nowrap rounded-sm text-sm font-base ring-offset-white transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-default disabled:opacity-40',
  {
    variants: {
      hover: {
        default: 'border-border shadow-default',
        noShadow: 'border-border',
        reverse: 'border-border shadow-reverse',
        reverseShadow: 'hover:shadow-shadow hover:border-shadow-border',
      },
      variant: {
        default:
          'bg-background text-foreground border-shadow-border hover:bg-primary-accent',
        outline: 'bg-transparent text-foreground border-border',
        ghost: 'bg-transparent shadow-none text-text border-transparent',
        primary:
          'text-primary-foreground bg-primary border-shadow-border dark:bg-primary-accent dark:text-primary dark:border-primary',
        accent: 'text-accent-foreground bg-accent',
        secondary:
          'text-secondary-foreground bg-secondary dark:bg-secondary-accent dark:text-secondary-accent-foreground dark:border-secondary-accent-foreground border-shadow-border',
        hoverSecondary:
          'bg-transparent text-foreground border-border hover:bg-secondary hover:text-secondary-foreground dark:hover:bg-secondary-accent dark:hover:text-secondary-accent-foreground dark:hover:border-secondary-accent-foreground hover:border-shadow-border hover:bg-secondary-accent',
        destructive:
          'text-destructive-foreground bg-destructive border-shadow-border',
      },
      size: {
        'default': 'h-9 px-4 py-2',
        'sm': 'h-8 px-3 rounded-xs',
        'md': 'h-10 px-5',
        'lg': 'h-12 px-8',
        'xl': 'h-14 px-10 text-lg border-2',
        '2xl': 'h-16 px-12 text-2xl border-2',
        'icon': 'h-10 w-10 rounded-full border-border [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hover: 'reverse',
    },
  },
)

interface ButtonProps
  extends React.ComponentProps<'button'>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isPending?: boolean
}

function Button({
  className,
  variant,
  hover,
  size,
  disabled,
  isPending,
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      disabled={disabled || isPending}
      data-slot="button"
      type="button"
      className={cn(buttonVariants({ variant, hover, size, className }))}
      {...props}
    >
      {isPending
        ? (
            <Loader2Icon className="animate-spin" />
          )
        : (
            <Slot.Slottable>{children}</Slot.Slottable>
          )}
    </Comp>
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
