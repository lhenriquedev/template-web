import { z } from "zod";

export const updateSubsubcategorySchema = z.object({
  name: z.string().min(1, "Nome da sub-subcategoria é obrigatório"),
  subcategory_id: z.string().min(1, "Subcategoria é obrigatória"),
});

export type UpdateSubsubcategorySchema = z.infer<
  typeof updateSubsubcategorySchema
>;
