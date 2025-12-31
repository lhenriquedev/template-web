import { z } from "zod";

export const updateCompanySchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  document: z.string().trim().min(1, "Documento é obrigatório"),
});

export type UpdateCompanySchema = z.infer<typeof updateCompanySchema>;
