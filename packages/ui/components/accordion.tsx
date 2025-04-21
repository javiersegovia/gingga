import type { VariantProps } from 'class-variance-authority'
import { cn } from '@gingga/ui/lib/utils'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cva } from 'class-variance-authority'
import { ChevronDown } from 'lucide-react'

import * as React from 'react'

const accordionItemVariants = cva('', {
  variants: {
    variant: {
      default: 'rounded-sm border-mborder shadow-shadow border-b',
      ghost: 'border-none shadow-none',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const accordionTriggerVariants = cva(
  'flex flex-1 cursor-pointer items-center justify-between text-base font-semibold transition-all [&[data-state=open]>svg]:rotate-180',
  {
    variants: {
      variant: {
        default:
          'rounded-sm bg-card font-body text-secondary-foreground p-4 [&[data-state=open]]:rounded-b-none [&[data-state=open]]:border-b',
        ghost: 'bg-transparent p-2 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const accordionContentVariants = cva(
  'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down rounded-b-sm overflow-hidden text-sm transition-all',
  {
    variants: {
      variant: {
        default: 'bg-card font-base',
        ghost: 'bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('rounded-base space-y-4', className)}
      {...props}
    />
  )
}

interface AccordionItemProps
  extends React.ComponentProps<typeof AccordionPrimitive.Item>,
  VariantProps<typeof accordionItemVariants> {}

function AccordionItem({ className, variant, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      data-variant={variant}
      className={cn(accordionItemVariants({ variant }), className)}
      {...props}
    />
  )
}

interface AccordionTriggerProps
  extends React.ComponentProps<typeof AccordionPrimitive.Trigger>,
  VariantProps<typeof accordionTriggerVariants> {}

function AccordionTrigger({
  className,
  children,
  variant,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        data-variant={variant}
        className={cn(accordionTriggerVariants({ variant }), className)}
        {...props}
      >
        <span>{children}</span>
        <ChevronDown className="mt-1.5 h-5 w-5 shrink-0 self-start transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

interface AccordionContentProps
  extends React.ComponentProps<typeof AccordionPrimitive.Content>,
  VariantProps<typeof accordionContentVariants> {}

function AccordionContent({
  className,
  children,
  variant,
  ...props
}: AccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      data-variant={variant}
      className={cn(accordionContentVariants({ variant }), className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
