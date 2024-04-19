import type { TRPCRouterRecord } from "@trpc/server";
import bcrypt from "bcrypt";
import { z } from "zod";

import { CreateBusSchema } from "@unibus/validators";

import { protectedProcedure, publicProcedure } from "../trpc";

export const busRouter = {
  all: publicProcedure.query(({ ctx }) => {
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
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(input.password, salt);
      return ctx.prisma.bus.create({
        data: { ...input, password: hash },
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
