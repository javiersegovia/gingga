import React from 'react'
import { useFieldContext } from '@/components/form/tanstack-form' // Assuming this hook provides the field context from TanStack Form
import { cn } from '@gingga/ui/lib/utils' // Adjusted path
import { FormFieldItemContext, FormFieldItemContextValues } from './form-field-context'

type FormFieldItemProps = React.ComponentProps<'div'>
const FormFieldItem: React.FC<FormFieldItemProps> = ({ className, ...props }) => {
  const field = useFieldContext() // This hook returns { name, errors, ... }
  const id = React.useId()
  const formFieldItemContextValues = React.useMemo<FormFieldItemContextValues>(
    () => ({
      id,
      name: field.name,
      hasError: field.state.meta.errors.length > 0, // Use field.errors directly
      errors: field.state.meta.errors, // Use field.errors directly
      formFieldItemId: `${id}-${field.name}-item`,
      formFieldDescriptionId: `${id}-${field.name}-description`,
      formFieldMessageId: `${id}-${field.name}-message`,
    }),
    [id, field.name, field.state.meta.errors], // Use field.errors in dependency array
  )

  return (
    <FormFieldItemContext.Provider value={formFieldItemContextValues}>
      <div id={`${id}-${field.name}`} className={cn('space-y-2', className)} {...props} />
    </FormFieldItemContext.Provider>
  )
}
export default FormFieldItem
