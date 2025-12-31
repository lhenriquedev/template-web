import { z } from "zod";

export const updateSubcategorySchema = z.object({
  name: z.string().min(1, "Nome da subcategoria é obrigatório"),
  category_id: z.string().min(1, "Categoria é obrigatória"),
});

export type UpdateSubcategorySchema = z.infer<typeof updateSubcategorySchema>;
