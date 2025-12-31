import { z } from "zod";

export const createSubcategorySchema = z.object({
  name: z.string().min(1, "Nome da subcategoria é obrigatório"),
  category_id: z.string().min(1, "Categoria é obrigatória"),
});

export type CreateSubcategorySchema = z.infer<typeof createSubcategorySchema>;
