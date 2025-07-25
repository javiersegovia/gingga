import type React from 'react'
import { cn } from '@gingga/ui/lib/utils'
import { useFormFieldItemContext } from './form-field-context'

type FormFieldDescriptionProps = React.ComponentProps<'p'>
const FormFieldDescription: React.FC<FormFieldDescriptionProps> = ({
  className,
  ...props
}) => {
  const { formFieldDescriptionId } = useFormFieldItemContext()

  return (
    <p
      id={formFieldDescriptionId}
      className={cn('text-muted-foreground text-[0.8rem] leading-5', className)}
      {...props}
    />
  )
}
export default FormFieldDescription
