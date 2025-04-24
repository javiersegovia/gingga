import type { Route } from './+types/reset-password'
import { PasswordSchema } from '@gingga/api/lib/auth/auth.schema'
import { Alert, AlertDescription, AlertTitle } from '@gingga/ui/components/alert'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { TerminalIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { href, Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { authClient } from '~/lib/auth/auth-client'

const ResetPasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'], // path of error
  })

// Schema to validate the search params (token and error)
// const ResetPasswordSearchSchema = z.object({
//   token: z.string().optional(),
//   error: z.string().optional(),
// })

// export const Route = createFileRoute('/_auth/reset-password')({
//   validateSearch: zodValidator(ResetPasswordSearchSchema), // Validate search params
//   component: ResetPasswordPage,
//   beforeLoad: async ({ context }) => {
//     if (context.auth?.session) {
//       throw redirect({
//         to: '/chat',
//       })
//     }
//   },
// })

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')
  const tokenError = url.searchParams.get('error')

  return { token, tokenError }
}

export default function ResetPasswordPage({ loaderData: { token, tokenError } }: Route.ComponentProps) {
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    if (!token) {
      // This should ideally not happen if tokenError is handled,
      // but defensive check is good.
      toast.error('Missing reset token.')
      return
    }

    await authClient.resetPassword(
      {
        newPassword: values.password,
        token,
      },
      {
        onSuccess: () => {
          toast.success('Password reset successfully!')
          navigate(href('/identify'))
        },
        onError: (ctx) => {
          toast.error('Failed to reset password', {
            description: ctx.error.message,
          })
          // If token becomes invalid after submission attempt, redirect
          if (ctx.error.code === 'INVALID_TOKEN') {
            navigate(href('/forgot-password'))
          }
        },
      },
    )
  }

  if (tokenError || !token) {
    return (
      <div className="flex w-full flex-col items-center gap-6">
        <Alert variant="destructive">
          <TerminalIcon className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {tokenError === 'invalid_token'
              ? 'The password reset link is invalid or has expired.'
              : 'Missing password reset token.'}
          </AlertDescription>
        </Alert>
        <Link
          to="/forgot-password"
          className="text-muted-foreground hover:text-brand-blue dark:hover:text-primary font-bold"
        >
          Request a new reset link
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-semibold">Reset Password</h1>
        <p className="text-muted-foreground text-sm">Enter your new password below.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm new password" {...field} />
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
            isPending={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Reset Password
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
