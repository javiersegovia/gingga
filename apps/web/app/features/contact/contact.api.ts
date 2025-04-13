import { createServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import { ContactFormSchema } from './contact.schema'
import { sendEmail } from '@/server/email/email'
import ContactFormEmail from '@/server/email/templates/contact-form-email'

/**
 * Server function to send contact form data to the contact email
 */
export const $submitContactForm = createServerFn({
  method: 'POST',
})
  .validator(zodValidator(ContactFormSchema))
  .handler(async ({ data }) => {
    try {
      // Send email notification to contact@gingga.com
      const emailResult = await sendEmail({
        to: 'contact@gingga.com',
        subject: `Contact Form Submission from ${data.name}`,
        react: ContactFormEmail({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      })

      if (emailResult.status === 'error') {
        console.error('Failed to send contact email:', emailResult.error)
        throw new Error('Failed to send your message. Please try again later.')
      }

      return {
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon!',
      }
    } catch (error) {
      console.error('Error sending contact email:', error)
      throw new Error('Failed to send your message. Please try again later.')
    }
  })
