import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import FormFieldItem from '~/components/form/field/form-field-item'
import FormFieldLabel from '~/components/form/field/form-field-label'
import FormFieldControl from '~/components/form/field/form-field-control'
import FormFieldControlIcon from '~/components/form/field/form-field-control-icon'
import FormFieldDescription from '~/components/form/field/form-field-description'
import FormFieldMessage from '~/components/form/field/form-field-message'
import FormButton from '~/components/form/form-button'

const fieldComponents = {
  FormFieldItem,
  FormFieldLabel,
  FormFieldControl,
  FormFieldControlIcon,
  FormFieldDescription,
  FormFieldMessage,
}
const formComponents = {
  FormButton,
}

// Revert: Remove explicit typing
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

// Only export the hooks and contexts needed
// Revert: Remove explicit typing
export const { withForm, useAppForm } = createFormHook({
  fieldComponents,
  formComponents,
  fieldContext,
  formContext,
})
