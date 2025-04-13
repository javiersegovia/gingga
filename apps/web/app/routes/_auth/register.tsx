import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
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
import { SignUpSchema } from '@/features/auth/auth.schema'
import { authClient } from '@/features/auth/auth.client'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormStatusButton } from '@gingga/ui/components/status-button'
import { toast } from 'sonner'

export const Route = createFileRoute('/_auth/register')({
  component: RegisterPage,
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/chat',
      })
    }
  },
})

function RegisterPage() {
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      ...(import.meta.env.DEV && {
        firstName: 'Test',
        lastName: 'User',
        email: `test${Math.random().toString(36).substring(2, 15)}@test.com`,
        password: '123123123',
        passwordConfirm: '123123123',
      }),
    },
  })

  async function onSubmit(data: z.infer<typeof SignUpSchema>) {
    await authClient.signUp.email(
      { ...data, name: `${data.firstName} ${data.lastName}` },
      {
        onSuccess: async () => {
          toast.success('Account created successfully', {
            description: 'Please check your email for verification',
          })
        },
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
      {form.formState.isSubmitSuccessful ? (
        <CheckEmail />
      ) : (
        <>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-semibold">Create Account</h1>
            <p className="text-muted-foreground text-sm">
              We&apos;ll send you a verification email to confirm your account.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-4">
                <FormStatusButton
                  type="submit"
                  variant="primary"
                  size="xl"
                  className="w-full"
                >
                  Register
                </FormStatusButton>
              </div>
            </form>
          </Form>

          <div className="flex items-center justify-center gap-1 text-sm">
            <span className="text-muted-foreground">Already have an account?</span>
            <Link
              to="/identify"
              className="hover:text-brand-blue dark:hover:text-primary text-foreground font-medium"
            >
              Sign in
            </Link>
          </div>
        </>
      )}
    </>
  )
}

function CheckEmail() {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h1 className="text-3xl font-semibold">Check your email</h1>
      <p className="text-muted-foreground text-sm">
        We sent a link to your email to verify your account. <br />
        You can close this window now.
      </p>
    </div>
  )
}
