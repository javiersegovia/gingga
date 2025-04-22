import type { z } from 'zod'
import { SignInSchema } from '@gingga/api/src/lib/auth/auth.schema'
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
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { authClient } from '~/features/auth/auth.client'

export const Route = createFileRoute('/_auth/identify')({
  component: AuthPage,
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/chat',
      })
    }
  },
})

function AuthPage() {
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof SignInSchema>) {
    await authClient.signIn.email(
      { ...data, callbackURL: '/chat', rememberMe: true },
      {
        onError: ({ error }) => {
          toast.error('An error occurred', {
            description: error.message,
          })
        },
      },
    )
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-semibold">Welcome!</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your account to continue.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end py-2">
            <Link
              to="/forgot-password"
              className="text-muted-foreground dark:hover:text-primary hover:text-brand-blue text-sm"
            >
              Forgot password?
            </Link>
          </div>

          <FormStatusButton type="submit" variant="primary" size="xl" className="w-full">
            Sign in
          </FormStatusButton>
        </form>
      </Form>

      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-muted-foreground">Don&apos;t have an account?</span>
        <Link
          to="/register"
          className="hover:text-brand-blue dark:hover:text-primary font-medium"
        >
          Register
        </Link>
      </div>
    </>
  )
}
