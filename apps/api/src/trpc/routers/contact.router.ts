import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { sendEmail } from '~/lib/email'
import ContactFormEmail from '~/lib/email/templates/contact-form-email'
import { publicProcedure, router } from '~/trpc'

export const contactRouter = router({
  submitContactForm: publicProcedure.input(z.object({
    name: z.string(),
    email: z.string().email(),
    message: z.string(),
  })).mutation(async ({ input }) => {
    const { name, email, message } = input
    try {
      const emailResult = await sendEmail({
        to: 'contact@gingga.com',
        subject: `Contact Form Submission from ${name}`,
        react: ContactFormEmail({
          name,
          email,
          message,
        }),
      })

      if (emailResult.status === 'error') {
        console.error('Failed to send contact email:', emailResult.error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to send your message. Please try again later.' })
      }

      return {
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon!',
      }
    }
    catch (error) {
      console.error('Error sending contact email:', error)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to send your message. Please try again later.' })
    }
  }),
})
