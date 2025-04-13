import * as React from 'react'
import { CheckIcon, LoaderCircleIcon, TriangleAlert } from 'lucide-react'
import { useSpinDelay } from 'spin-delay'
import { useFormContext } from 'react-hook-form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { Button } from './button'
import type { ButtonProps } from './button'
import { cn } from '@gingga/ui/lib/utils'

type Status = 'pending' | 'success' | 'error' | 'idle'

interface StatusButtonProps extends ButtonProps {
  message?: string
  status: Status
  spinDelay?: Parameters<typeof useSpinDelay>[1]
  spinIcon?: React.ReactNode
}

function StatusButton({
  message,
  status,
  className,
  children,
  spinDelay: spinDelayProps,
  spinIcon,
  ...props
}: StatusButtonProps) {
  const delayedPending = useSpinDelay(status === 'pending', {
    delay: 400,
    minDuration: 300,
    ...spinDelayProps,
  })

  const companion = {
    pending: delayedPending ? (
      <div role="status" className="inline-flex h-6 w-6 items-center justify-center">
        {spinIcon ?? <LoaderCircleIcon className="animate-spin" />}
      </div>
    ) : null,
    success: (
      <div role="status" className="inline-flex h-6 w-6 items-center justify-center">
        <CheckIcon />
      </div>
    ),
    error: (
      <div
        role="status"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full"
      >
        <TriangleAlert className="text-destructive" />
      </div>
    ),
    idle: null,
  }[status]

  return (
    <Button
      data-slot="status-button"
      className={cn('flex justify-center gap-4', className)}
      {...props}
    >
      <div>{children}</div>
      {message ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{companion}</TooltipTrigger>
            <TooltipContent>{message}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        companion
      )}
    </Button>
  )
}

interface FormStatusButtonProps extends ButtonProps {
  state?: 'submitting' | 'loading' | 'idle'
  showSuccessIcon?: boolean
}

function FormStatusButton({
  children,
  state = 'idle',
  showSuccessIcon = false,
  ...props
}: FormStatusButtonProps) {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
  } = useFormContext()
  const isPending = isSubmitting || state !== 'idle'
  const isSuccess = isSubmitSuccessful && showSuccessIcon

  return (
    <StatusButton
      data-slot="form-status-button"
      status={isPending ? 'pending' : isSuccess ? 'success' : 'idle'}
      disabled={isPending}
      {...props}
    >
      {children}
    </StatusButton>
  )
}

export { StatusButton, FormStatusButton }
export type { StatusButtonProps, FormStatusButtonProps }
