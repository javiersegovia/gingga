import type React from 'react'
import { Suspense } from 'react'
import { useAppForm } from '~/components/form/tanstack-form'
import { Input } from '@gingga/ui/components/input'
import { Skeleton } from '@gingga/ui/components/skeleton'
import { Users, UserMemberships } from '@gingga/db/schema'
import type { UserFormValues } from '../user.schema'
import { userFormOptions, UserFormSchema } from '../user.schema'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gingga/ui/components/select'
import { Button } from '@gingga/ui/components/button'
import { useImpersonateUser, useBanUser } from '../user.query'

interface UserFormProps {
  initialValues?: Partial<UserFormValues>
  isSubmitting?: boolean
  formProps?: React.ComponentProps<'form'>
  onSubmit: (data: UserFormValues) => Promise<void> | void
}

export function UserForm({
  initialValues,
  isSubmitting = false,
  formProps,
  onSubmit,
}: UserFormProps) {
  const impersonateUserMutation = useImpersonateUser()
  const banUserMutation = useBanUser()

  const form = useAppForm({
    ...userFormOptions,
    defaultValues: {
      ...userFormOptions.defaultValues,
      ...initialValues,
    },
    onSubmit: async ({ value, formApi }) => {
      await onSubmit(value)
      formApi.reset()
    },
    validators: {
      onSubmit: UserFormSchema,
    },
  })

  const handleImpersonate = () => {
    if (initialValues?.userId) {
      impersonateUserMutation.mutate({ userId: initialValues.userId })
    }
  }

  const handleBan = () => {
    if (initialValues?.userId) {
      banUserMutation.mutate({
        userId: initialValues.userId,
        banReason: 'Administrative action',
        banDurationDays: 30,
      })
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      {...formProps}
      className="space-y-4"
    >
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <form.AppField
          name="name"
          validators={{
            onChange: UserFormSchema.shape.name,
          }}
        >
          {(field) => (
            <field.FormFieldItem>
              <field.FormFieldLabel>Name</field.FormFieldLabel>
              <field.FormFieldControl>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Enter full name"
                  aria-invalid={!!field.state.meta.errors.length}
                  aria-describedby={
                    field.state.meta.errors.length ? `${field.name}-errors` : undefined
                  }
                />
              </field.FormFieldControl>
              <field.FormFieldMessage id={`${field.name}-errors`} />
            </field.FormFieldItem>
          )}
        </form.AppField>

        <form.AppField
          name="firstName"
          validators={{
            onChange: UserFormSchema.shape.firstName,
          }}
        >
          {(field) => (
            <field.FormFieldItem>
              <field.FormFieldLabel>First Name</field.FormFieldLabel>
              <field.FormFieldControl>
                <Input
                  name={field.name}
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Enter first name"
                  aria-invalid={!!field.state.meta.errors.length}
                  aria-describedby={
                    field.state.meta.errors.length ? `${field.name}-errors` : undefined
                  }
                />
              </field.FormFieldControl>
              <field.FormFieldMessage id={`${field.name}-errors`} />
            </field.FormFieldItem>
          )}
        </form.AppField>

        <form.AppField
          name="lastName"
          validators={{
            onChange: UserFormSchema.shape.lastName,
          }}
        >
          {(field) => (
            <field.FormFieldItem>
              <field.FormFieldLabel>Last Name</field.FormFieldLabel>
              <field.FormFieldControl>
                <Input
                  name={field.name}
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Enter last name"
                  aria-invalid={!!field.state.meta.errors.length}
                  aria-describedby={
                    field.state.meta.errors.length ? `${field.name}-errors` : undefined
                  }
                />
              </field.FormFieldControl>
              <field.FormFieldMessage id={`${field.name}-errors`} />
            </field.FormFieldItem>
          )}
        </form.AppField>

        <form.AppField
          name="email"
          validators={{
            onChange: UserFormSchema.shape.email,
          }}
        >
          {(field) => (
            <field.FormFieldItem>
              <field.FormFieldLabel>Email</field.FormFieldLabel>
              <field.FormFieldControl>
                <Input
                  type="email"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Enter email"
                  aria-invalid={!!field.state.meta.errors.length}
                  aria-describedby={
                    field.state.meta.errors.length ? `${field.name}-errors` : undefined
                  }
                />
              </field.FormFieldControl>
              <field.FormFieldMessage id={`${field.name}-errors`} />
            </field.FormFieldItem>
          )}
        </form.AppField>

        <form.AppField
          name="role"
          validators={{
            onChange: UserFormSchema.shape.role,
          }}
        >
          {(field) => (
            <field.FormFieldItem>
              <field.FormFieldLabel>Role</field.FormFieldLabel>
              <field.FormFieldControl>
                <Select
                  name={field.name}
                  value={field.state.value ?? ''}
                  onValueChange={(value) =>
                    field.handleChange(value as (typeof Users.role.enumValues)[number])
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Users.role.enumValues.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </field.FormFieldControl>
              <field.FormFieldMessage id={`${field.name}-errors`} />
            </field.FormFieldItem>
          )}
        </form.AppField>

        <form.AppField
          name="membershipTier"
          validators={{
            onChange: UserFormSchema.shape.membershipTier,
          }}
        >
          {(field) => (
            <field.FormFieldItem>
              <field.FormFieldLabel>Membership Tier</field.FormFieldLabel>
              <field.FormFieldControl>
                <Select
                  name={field.name}
                  value={field.state.value ?? ''}
                  onValueChange={(value) =>
                    field.handleChange(value as 'basic' | 'pro' | 'enterprise')
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a membership tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {UserMemberships.tier.enumValues.map((tier) => (
                      <SelectItem key={tier} value={tier}>
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </field.FormFieldControl>
              <field.FormFieldMessage id={`${field.name}-errors`} />
            </field.FormFieldItem>
          )}
        </form.AppField>
      </Suspense>
      <form.AppForm>
        <div className="mt-10 flex flex-wrap gap-2">
          <form.FormButton variant="primary" size="lg" className="flex-1">
            {({ isSubmitting }) => (isSubmitting ? 'Saving...' : 'Save User')}
          </form.FormButton>

          {initialValues?.userId && (
            <>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleImpersonate}
                disabled={impersonateUserMutation.isPending}
                className="flex-1"
              >
                {impersonateUserMutation.isPending ? 'Impersonating...' : 'Impersonate'}
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="lg"
                onClick={handleBan}
                disabled={banUserMutation.isPending}
                className="flex-1"
              >
                {banUserMutation.isPending ? 'Banning...' : 'Ban User'}
              </Button>
            </>
          )}
        </div>
      </form.AppForm>
    </form>
  )
}
