import { TRPCError } from '@trpc/server'
import { protectedProcedure, router } from '~/server/trpc'
import { BanUserSchema, UpdateUserSchema, UserIdSchema } from './user.schema'
import {
  banUser,
  deleteUser,
  getUserById,
  getUsers,
  impersonateUser,
  unbanUser,
  updateUser,
} from './user.service'

export const userRouter = router({
  getUsers: protectedProcedure.query(async () => {
    try {
      const users = await getUsers()
      return users
    }
    catch (error) {
      console.error('API Error fetching users:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve users',
        cause: error,
      })
    }
  }),

  getUserDetails: protectedProcedure
    .input(UserIdSchema)
    .query(async ({ input }: { input: { userId: string } }) => {
      try {
        const user = await getUserById(input.userId)
        if (!user) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
        }
        return user
      }
      catch (error) {
        console.error(`API Error fetching user ${input.userId}:`, error)
        if (error instanceof TRPCError)
          throw error
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to retrieve user details',
          cause: error,
        })
      }
    }),

  updateUser: protectedProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ input }: { input: typeof UpdateUserSchema._input }) => {
      try {
        const updatedUser = await updateUser(input)
        return updatedUser
      }
      catch (error) {
        console.error(`API Error updating user ${input.userId}:`, error)
        if (error instanceof Error && error.name === 'NotFoundError') {
          throw new TRPCError({ code: 'NOT_FOUND', message: error.message })
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update user',
          cause: error,
        })
      }
    }),

  deleteUser: protectedProcedure
    .input(UserIdSchema)
    .mutation(async ({ input }: { input: { userId: string } }) => {
      try {
        await deleteUser(input.userId)
        return { success: true }
      }
      catch (error) {
        console.error(`API Error deleting user ${input.userId}:`, error)
        if (error instanceof Error && error.name === 'NotFoundError') {
          throw new TRPCError({ code: 'NOT_FOUND', message: error.message })
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete user',
          cause: error,
        })
      }
    }),

  banUser: protectedProcedure.input(BanUserSchema).mutation(async ({ input }: { input: typeof BanUserSchema._input }) => {
    try {
      await banUser(input)
      return { success: true }
    }
    catch (error) {
      console.error(`API Error banning user ${input.userId}:`, error)
      if (error instanceof Error && error.name === 'NotFoundError') {
        throw new TRPCError({ code: 'NOT_FOUND', message: error.message })
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to ban user',
        cause: error,
      })
    }
  }),

  unbanUser: protectedProcedure
    .input(UserIdSchema)
    .mutation(async ({ input }: { input: { userId: string } }) => {
      try {
        await unbanUser(input.userId)
        return { success: true }
      }
      catch (error) {
        console.error(`API Error unbanning user ${input.userId}:`, error)
        if (error instanceof Error && error.name === 'NotFoundError') {
          throw new TRPCError({ code: 'NOT_FOUND', message: error.message })
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error ? error.message : 'Failed to unban user',
          cause: error,
        })
      }
    }),

  impersonateUser: protectedProcedure
    .input(UserIdSchema)
    .mutation(async ({ input }: { input: { userId: string } }) => {
      try {
        await impersonateUser(input.userId)
        return { success: true }
      }
      catch (error) {
        console.error(`API Error impersonating user ${input.userId}:`, error)
        if (
          error instanceof Error
          && error.message === 'Cannot impersonate another admin.'
        ) {
          throw new TRPCError({ code: 'FORBIDDEN', message: error.message })
        }
        else if (error instanceof Error && error.name === 'NotFoundError') {
          throw new TRPCError({ code: 'NOT_FOUND', message: error.message })
        }
        else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              error instanceof Error
                ? error.message
                : 'Failed to impersonate user',
            cause: error,
          })
        }
      }
    }),
})

export type UserRouter = typeof userRouter
