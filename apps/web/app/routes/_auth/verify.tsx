import { createFileRoute, redirect } from '@tanstack/react-router'
import { Button } from '@gingga/ui/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gingga/ui/components/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@gingga/ui/components/input-otp'
import { VerifySchema } from '@/features/auth/auth.schema'
import { useForm } from 'react-hook-form'
import { zodValidator } from '@tanstack/zod-adapter'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormStatusButton } from '@gingga/ui/components/status-button'

const VerifySearchParams = VerifySchema.partial()

export const Route = createFileRoute('/_auth/verify')({
  component: VerifyPage,
  validateSearch: zodValidator(VerifySearchParams),
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/chat',
      })
    }
  },
})

function VerifyPage() {
  const { code, type } = Route.useSearch()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      code,
      type,
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(data: any) {
    // TODO: Implement verification logic
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-semibold">Check your email</h1>
        <p className="text-muted-foreground text-sm">
          We&apos;ve sent a verification code to your email address.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="mx-auto w-full text-center">
                <FormLabel>Verification code</FormLabel>

                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="mx-auto">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <div className="pt-2" />

          <FormStatusButton type="submit" size="xl" variant="primary" className="w-full">
            Verify email
          </FormStatusButton>
        </form>
      </Form>

      {/* <div className="flex flex-col items-center gap-2 text-center text-sm">
        <p className="text-muted-foreground">
          Didn&apos;t receive the code?{' '}
          <Button variant="ghost" className="h-auto p-0 text-sm font-normal">
            Click to resend
          </Button>
        </p>
      </div> */}
    </>
  )
}
