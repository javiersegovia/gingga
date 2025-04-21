import type React from 'react'
import { buttonVariants } from '@gingga/ui/components/button' // Adjusted path
import { cn } from '@gingga/ui/lib/utils' // Adjusted path
import { Slot } from '@radix-ui/react-slot'
import { useFormFieldItemContext } from './form-field-context'

type FormFieldControlIconProps = React.ComponentProps<'div'> & {
  icon: React.ReactNode
}
const FormFieldControlIcon: React.FC<FormFieldControlIconProps> = ({
  className,
  children,
  icon,
  ...props
}) => {
  const { hasError, id, name } = useFormFieldItemContext()
  return (
    <div
      id={`${id}-${name}-control-icon`}
      className={cn('relative', className)}
      {...props}
    >
      <div
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'hover:bg-transparent',
          'absolute top-0 left-0 inline-flex h-full items-center justify-center px-3 py-2',
          hasError && 'text-destructive',
        )}
      >
        {icon}
      </div>
      <Slot className="pl-9">{children}</Slot>
    </div>
  )
}
export default FormFieldControlIcon
