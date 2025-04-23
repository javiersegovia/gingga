import type React from 'react'
import { Label } from '~/components/ui/label' // Adjusted path
import { cn } from '~/lib/utils' // Adjusted path
import { useFormFieldItemContext } from './form-field-context'

// Use React.ComponentProps to get the type
type FormFieldLabelProps = React.ComponentProps<typeof Label>

const FormFieldLabel: React.FC<FormFieldLabelProps> = ({ className, ...props }) => {
  const { hasError, formFieldItemId } = useFormFieldItemContext()

  return (
    <Label
      htmlFor={formFieldItemId}
      className={cn('block pb-[2px]', hasError && 'text-destructive', className)}
      {...props}
    />
  )
}
export default FormFieldLabel
