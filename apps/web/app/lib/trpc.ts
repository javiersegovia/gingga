import { createTRPCContext } from '@trpc/tanstack-react-query'
import type { TRPCAppRouter } from '@gingga/api/src/trpc/routers/index'

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<TRPCAppRouter>()
