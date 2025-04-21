import type { TRPCAppRouter } from '@gingga/api/src/trpc/routers/index'
import { createTRPCContext } from '@trpc/tanstack-react-query'

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<TRPCAppRouter>()
