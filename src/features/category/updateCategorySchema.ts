import { z } from "zod";

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1, "Nome da categoria é obrigatório"),
});

export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
