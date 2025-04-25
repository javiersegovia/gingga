import type React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { useFormFieldItemContext } from './form-field-context'

type FormFieldControlProps = React.ComponentProps<typeof Slot>
const FormFieldControl: React.FC<FormFieldControlProps> = ({ ...props }) => {
  const { hasError, formFieldItemId, formFieldMessageId } = useFormFieldItemContext()

  return (
    <Slot
      id={formFieldItemId}
      aria-describedby={hasError ? `${formFieldMessageId}` : undefined}
      aria-invalid={hasError}
      {...props}
    />
  )
}

export default FormFieldControl
