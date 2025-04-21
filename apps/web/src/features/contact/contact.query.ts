import type { ContactFormInput } from './contact.schema'
import { useMutation } from '@tanstack/react-query'
import { $submitContactForm } from './contact.api'

/**
 * Hook for submitting the contact form
 */
export function useSubmitContactForm() {
  return useMutation({
    mutationFn: (formData: ContactFormInput) => $submitContactForm({ data: formData }),
    onSuccess: async () => {
      // No need to invalidate queries since this is a submission-only form
      // that doesn't affect any existing query data
    },
  })
}
