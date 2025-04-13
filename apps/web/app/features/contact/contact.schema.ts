import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long' }),
})

export type ContactFormInput = z.infer<typeof ContactFormSchema>
