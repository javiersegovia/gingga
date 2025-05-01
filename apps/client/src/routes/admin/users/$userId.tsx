import type { UserMemberships } from '@gingga/db/schema'
import type { Route } from './+types/$userId'
import type { UserFormValues } from '~/features/admin/users/user.schema'
import { UserForm } from '~/features/admin/users/components/user-form'
import { useGetUserDetailsQuery, useUpdateUserMutation } from '~/features/admin/users/user.query'

export async function loader({ params }: Route.LoaderArgs) {
  return { userId: params.userId }
}

export default function UserDetailsRoute({ loaderData }: Route.ComponentProps) {
  const { userId } = loaderData
  const updateUserMutation = useUpdateUserMutation()
  const { data: user, isLoading, error } = useGetUserDetailsQuery(userId)

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

  if (isLoading)
    return <div>Loading...</div>

  if (error)
    return <div>Error loading user details</div>

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
