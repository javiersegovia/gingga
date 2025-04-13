import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@gingga/ui/components/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gingga/ui/components/form'
import { EmailSchema } from '@/features/auth/auth.schema'
import { FormStatusButton } from '@gingga/ui/components/status-button'
import { toast } from 'sonner'
import { authClient } from '@/features/auth/auth.client'

const ForgotPasswordSchema = z.object({
  email: EmailSchema,
})

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPasswordPage,
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/chat',
      })
    }
  },
})

function ForgotPasswordPage() {
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
    await authClient.forgetPassword(
      {
        email: values.email,
        redirectTo: '/reset-password',
      },
      {
        onSuccess: () => {
          toast.success('Password reset instructions sent!', {
            description: 'Please check your email inbox.',
          })
        },
        onError: (ctx) => {
          toast.error('Failed to send instructions', {
            description: ctx.error.message,
          })
        },
      },
    )
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-semibold">Forgot password?</h1>
        <p className="text-muted-foreground text-sm">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2" />

          <FormStatusButton
            type="submit"
            variant="primary"
            size="xl"
            className="w-full"
            disabled={form.formState.isSubmitting}
            isPending={form.formState.isSubmitting}
          >
            Send instructions
          </FormStatusButton>
        </form>
      </Form>

      <div className="flex items-center justify-center gap-1 text-base">
        <Link
          to="/identify"
          className="text-muted-foreground hover:text-brand-blue dark:hover:text-primary font-bold"
        >
          Back to sign in
        </Link>
      </div>
    </>
  )
}
