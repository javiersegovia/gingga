import type { Agents } from '@/db/schema'

// Infer type directly from the Drizzle schema definition
export type Agent = typeof Agents.$inferSelect
