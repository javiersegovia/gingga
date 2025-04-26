import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gingga/ui/components/form'
import { Input } from '@gingga/ui/components/input'
import { FormStatusButton } from '@gingga/ui/components/status-button'
import { Textarea } from '@gingga/ui/components/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useTRPC } from '~/lib/trpc/react'
// import { useSubmitContactForm } from '../contact.query'

export const ContactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long' }),
})
export type ContactFormInput = z.infer<typeof ContactFormSchema>

export function ContactForm() {
  const trpc = useTRPC()
  const submitContactForm = useMutation(trpc.contact.submitContactForm.mutationOptions())

  const form = useForm<z.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const handleSubmit = async (data: z.infer<typeof ContactFormSchema>) => {
    submitContactForm.mutate(data, {
      onSuccess: (response) => {
        toast.success('Message sent!', {
          description: response.message,
        })
        form.reset()
      },
      onError: (error) => {
        toast.error('Error sending message', {
          description:
            error instanceof Error ? error.message : 'An unknown error occurred',
        })
      },
    })
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Your message" rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormStatusButton
            type="submit"
            className="w-full"
            variant="secondary"
            size="xl"
            disabled={submitContactForm.isPending}
          >
            {submitContactForm.isPending ? 'Sending...' : 'Send'}
          </FormStatusButton>
        </form>
      </Form>
    </div>
  )
}
