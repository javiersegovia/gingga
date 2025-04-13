import { z } from 'zod'
import { Users } from '@/db/schema' // For enum reference
import { formOptions } from '@tanstack/react-form'

// Helper to transform DB timestamp (number) to Date
const timestampToDate = z.preprocess((arg) => {
  if (typeof arg === 'number') {
    return new Date(arg)
  }
  return arg
}, z.date())

// Base User Schema reflecting the DB structure
export const BaseUserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().email(),
  emailVerified: z.boolean().nullable(),
  image: z.string().nullable(),
  role: z.enum(Users.role.enumValues), // Use enum values from DB schema
  banned: z.boolean().nullable(),
  banReason: z.string().nullable(),
  banExpires: timestampToDate.nullable(),
  createdAt: timestampToDate,
  updatedAt: timestampToDate.nullable(),

  // Extended fields from joins/relations
  membershipTier: z.string().nullable().optional(), // Tier from UserMemberships
  chatCount: z.number().int().optional(), // Count from Chats table
  messageCount: z.number().int().optional(), // Count from ChatMessages table
})
export type BaseUser = z.infer<typeof BaseUserSchema>

// Schema for user data returned in lists
export const UserListEntrySchema = BaseUserSchema.extend({
  // Add related data needed for the table
  membershipTier: z.string().nullable().optional(), // Example: from UserMemberships
  chatCount: z.number().int().optional(), // Placeholder
  messageCount: z.number().int().optional(), // Placeholder
}).omit({
  // Omit fields not needed in the list view
  emailVerified: true,
  banReason: true,
  banExpires: true,
  updatedAt: true,
  // You might omit firstName/lastName if 'name' is preferred
})
export type UserListEntry = z.infer<typeof UserListEntrySchema>

// Schema for detailed single user view (can be same as Base or extended)
export const UserDetailsSchema = BaseUserSchema.extend({
  membershipTier: z.string().nullable().optional(), // Example
  // Add other details like sessions, accounts if needed
})
export type UserDetails = z.infer<typeof UserDetailsSchema>

// Schema for updating a user (only include fields an admin can change)
export const UpdateUserSchema = z.object({
  userId: z.string(),
  // Add specific fields that can be updated, e.g.:
  role: z.enum(Users.role.enumValues).optional(),
  name: z.string().optional(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  email: z.string().email().optional(),
  membershipTier: z.enum(['basic', 'pro', 'enterprise']).optional().nullable(),
})
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>

// Schema for banning a user
export const BanUserSchema = z.object({
  userId: z.string(),
  banReason: z.string().min(1, 'Ban reason is required'),
  banDurationDays: z.number().int().positive().optional().nullable(), // Optional duration in days
})
export type BanUserInput = z.infer<typeof BanUserSchema>

// Schema for actions requiring only user ID (unban, delete, impersonate)
export const UserIdSchema = z.object({
  userId: z.string(),
})
export type UserIdInput = z.infer<typeof UserIdSchema>

// Schema specifically for the UserForm component
export const UserFormSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  email: z.string().email('Invalid email address'),
  role: z.enum(Users.role.enumValues).optional(),
  membershipTier: z.enum(['basic', 'pro', 'enterprise']).optional().nullable(),
})
export type UserFormValues = z.infer<typeof UserFormSchema>

export const userFormOptions = formOptions({
  defaultValues: {
    userId: '',
    name: '',
    firstName: null,
    lastName: null,
    email: '',
    role: Users.role.enumValues[0],
    membershipTier: 'basic',
  } as UserFormValues,
  validators: {
    onSubmit: UserFormSchema,
  },
})
