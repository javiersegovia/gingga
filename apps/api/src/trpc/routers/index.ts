import { Users } from "@gingga/db/schema";
import { count } from "@gingga/db";
import { protectedProcedure, publicProcedure, router } from "../index";
import { authRouter } from "./auth.router";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  auth: authRouter,
  privateData: protectedProcedure.query(async ({ ctx }) => {
    console.log(" HELLO FROM API TRPC");
    const usersCount = await ctx.db.select({ count: count() }).from(Users);
    return {
      message: `We have ${usersCount[0].count} users`,
    };
  }),
});

export type TRPCAppRouter = typeof appRouter;
