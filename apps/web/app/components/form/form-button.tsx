import type { ButtonProps } from '@gingga/ui/components/button'
import type React from 'react'
import { Button } from '@gingga/ui/components/button'
import { useFormContext } from './tanstack-form'

type FormButtonProps = Omit<ButtonProps, 'children'> & {
  children?:
    | ((props: { isSubmitting?: boolean, canSubmit?: boolean }) => React.ReactNode)
    | React.ReactNode
}

const FormButton: React.FC<FormButtonProps> = ({ children, ...props }) => {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={state => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => (
        <Button disabled={!canSubmit} isPending={isSubmitting} type="submit" {...props}>
          {typeof children === 'function'
            ? children({ isSubmitting, canSubmit })
            : children || 'Submit'}
        </Button>
      )}
    />
  )
}
export default FormButton
