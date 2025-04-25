import type { StandardSchemaV1Issue } from '@tanstack/react-form'
import React from 'react'

export interface FormFieldItemContextValues {
  id: string
  name: string
  hasError: boolean
  errors: StandardSchemaV1Issue[]
  formFieldItemId: string
  formFieldDescriptionId: string
  formFieldMessageId: string
}

export const FormFieldItemContext = React.createContext<
  FormFieldItemContextValues | undefined
>(undefined)

export function useFormFieldItemContext() {
  const context = React.use(FormFieldItemContext)

  if (typeof context === 'undefined') {
    throw new TypeError('useFormFieldItem should be used within <FormFieldItemContext/>')
  }

  return context
}
