import React from 'react'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { UserForm } from '@/features/admin/users/components/user-form'
import { userDetailsQueryOptions, useUpdateUser } from '@/features/admin/users/user.query'
import { UserFormValues } from '@/features/admin/users/user.schema'
import { UserMemberships } from '@/db/schema'

export const Route = createFileRoute('/admin/users/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = useParams({ from: '/admin/users/$userId' })
  const updateUserMutation = useUpdateUser()
  const { data: user, isLoading, error } = useQuery(userDetailsQueryOptions(userId))

  const handleUpdate = async (values: UserFormValues) => {
    // Map form values to the expected UpdateUserInput format
    await updateUserMutation.mutateAsync({
      userId,
      name: values.name,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      role: values.role,
      membershipTier: values.membershipTier,
    })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading user details</div>

  // Map user data to form values format
  const initialValues: Partial<UserFormValues> = user
    ? {
        userId: user.id,
        name: user.name ?? '',
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        membershipTier:
          user.membershipTier as (typeof UserMemberships.tier.enumValues)[number],
      }
    : {}

  return (
    <div className="mx-auto max-w-md py-10">
      <h1 className="mb-4 text-2xl font-bold">Edit User</h1>
      <div className="">
        <UserForm
          initialValues={initialValues}
          isSubmitting={updateUserMutation.isPending}
          onSubmit={handleUpdate}
        />
      </div>
    </div>
  )
}
