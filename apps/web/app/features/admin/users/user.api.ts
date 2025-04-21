import { createServerFn } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'
import { zodValidator } from '@tanstack/zod-adapter'
import { adminMiddleware } from '~/middleware/admin-guard'
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

export const $getUsers = createServerFn({
  method: 'GET',
  // No input schema needed for getting all users
})
  .middleware([adminMiddleware])
  .handler(async () => {
    try {
      const users = await getUsers()
      return users
    }
    catch (error) {
      console.error('API Error fetching users:', error)
      setResponseStatus(500)
      throw new Error('Failed to retrieve users')
    }
  })

export const $getUserDetails = createServerFn({
  method: 'GET',
})
  .validator(zodValidator(UserIdSchema))
  .middleware([adminMiddleware])
  .handler(async ({ data }) => {
    try {
      const user = await getUserById(data.userId)
      if (!user) {
        setResponseStatus(404)
        return null // Or throw new Error('User not found')
      }
      return user
    }
    catch (error) {
      console.error(`API Error fetching user ${data.userId}:`, error)
      if (error instanceof Error && error.name === 'NotFoundError') {
        setResponseStatus(404)
      }
      else {
        setResponseStatus(500)
      }
      throw new Error(
        error instanceof Error ? error.message : 'Failed to retrieve user details',
      )
    }
  })

export const $updateUser = createServerFn({
  method: 'POST',
})
  .validator(zodValidator(UpdateUserSchema))
  .middleware([adminMiddleware])
  .handler(async ({ data }) => {
    try {
      const updatedUser = await updateUser(data)
      return updatedUser
    }
    catch (error) {
      console.error(`API Error updating user ${data.userId}:`, error)
      if (error instanceof Error && error.name === 'NotFoundError') {
        setResponseStatus(404)
      }
      else {
        setResponseStatus(500)
      }
      throw new Error(error instanceof Error ? error.message : 'Failed to update user')
    }
  })

export const $deleteUser = createServerFn({
  method: 'POST',
})
  .validator(zodValidator(UserIdSchema))
  .middleware([adminMiddleware])
  .handler(async ({ data }) => {
    try {
      await deleteUser(data.userId)
      return { success: true }
    }
    catch (error) {
      console.error(`API Error deleting user ${data.userId}:`, error)
      if (error instanceof Error && error.name === 'NotFoundError') {
        setResponseStatus(404)
      }
      else {
        setResponseStatus(500)
      }
      throw new Error(error instanceof Error ? error.message : 'Failed to delete user')
    }
  })

export const $banUser = createServerFn({
  method: 'POST',
})
  .validator(zodValidator(BanUserSchema))
  .middleware([adminMiddleware])
  .handler(async ({ data }) => {
    try {
      await banUser(data)
      return { success: true }
    }
    catch (error) {
      console.error(`API Error banning user ${data.userId}:`, error)
      if (error instanceof Error && error.name === 'NotFoundError') {
        setResponseStatus(404)
      }
      else {
        setResponseStatus(500)
      }
      throw new Error(error instanceof Error ? error.message : 'Failed to ban user')
    }
  })

export const $unbanUser = createServerFn({
  method: 'POST',
})
  .validator(zodValidator(UserIdSchema))
  .middleware([adminMiddleware])
  .handler(async ({ data }) => {
    try {
      await unbanUser(data.userId)
      return { success: true }
    }
    catch (error) {
      console.error(`API Error unbanning user ${data.userId}:`, error)
      if (error instanceof Error && error.name === 'NotFoundError') {
        setResponseStatus(404)
      }
      else {
        setResponseStatus(500)
      }
      throw new Error(error instanceof Error ? error.message : 'Failed to unban user')
    }
  })

export const $impersonateUser = createServerFn({
  method: 'POST',
})
  .validator(zodValidator(UserIdSchema))
  .middleware([adminMiddleware])
  .handler(async ({ data, context }) => {
    try {
      const adminUserId = context.auth.user?.id
      if (!adminUserId) {
        setResponseStatus(401) // Should be caught by authMiddleware, but belt-and-suspenders
        throw new Error('Admin user ID not found in context')
      }
      await impersonateUser(data.userId, adminUserId)
      // Impersonation likely involves setting a cookie or similar server-side state,
      // so a successful response (default 200 OK) is usually sufficient.
      // return { success: true }
    }
    catch (error) {
      console.error(`API Error impersonating user ${data.userId}:`, error)
      if (
        error instanceof Error
        && error.message === 'Cannot impersonate another admin.'
      ) {
        setResponseStatus(403) // Forbidden
      }
      else if (error instanceof Error && error.name === 'NotFoundError') {
        setResponseStatus(404)
      }
      else {
        setResponseStatus(500)
      }
      throw new Error(
        error instanceof Error ? error.message : 'Failed to impersonate user',
      )
    }
  })
