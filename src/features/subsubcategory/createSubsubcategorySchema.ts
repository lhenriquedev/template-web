import { z } from "zod";

export const createSubsubcategorySchema = z.object({
  name: z.string().min(1, "Nome da sub-subcategoria é obrigatório"),
  subcategory_id: z.string().min(1, "Subcategoria é obrigatória"),
});

export type CreateSubsubcategorySchema = z.infer<
  typeof createSubsubcategorySchema
>;
