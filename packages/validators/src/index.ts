import { z } from "zod";

export const busSchema = z.object({
  id: z.string(),
  plate: z.string(),
  password: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateBusSchema = busSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
