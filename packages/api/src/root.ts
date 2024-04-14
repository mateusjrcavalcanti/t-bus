import { authRouter } from "./router/auth";
import { busRouter } from "./router/bus";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  bus: busRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
