import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { CreateBusSchema } from "@unibus/validators";

import { protectedProcedure, publicProcedure } from "../trpc";

export const busRouter = {
  all: publicProcedure.query(({ ctx }) => {
    // return ctx.prisma.select().from(schema.bus).orderBy(desc(schema.bus.id));
    return ctx.prisma.bus.findMany();
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.bus.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(CreateBusSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bus.create({
        data: input,
      });
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.bus.delete({
      where: {
        id: input,
      },
    });
  }),
} satisfies TRPCRouterRecord;
