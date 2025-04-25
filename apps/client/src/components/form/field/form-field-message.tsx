import type React from 'react'
import { cn } from '@gingga/ui/lib/utils'
import { useFormFieldItemContext } from './form-field-context'

type FormFieldMessageProps = React.ComponentProps<'p'>
const FormFieldMessage: React.FC<FormFieldMessageProps> = ({
  className,
  children, // Allow children for custom messages
  ...props
}) => {
  const { hasError, errors, formFieldMessageId } = useFormFieldItemContext()

  // Prioritize children if provided, otherwise show joined errors
  const body
    = children
      ?? (errors.length > 0 ? errors.map(error => error.message).join(', ') : null)

  return hasError && body
    ? (
        <p
          id={formFieldMessageId}
          className={cn(
            'text-destructive -mt-1 ml-2 min-h-2 text-xs leading-3 font-medium',
            className,
          )}
          {...props}
        >
          {body}
        </p>
      )
    : null
}

export default FormFieldMessage
