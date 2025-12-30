import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Nome da categoria é obrigatório"),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
