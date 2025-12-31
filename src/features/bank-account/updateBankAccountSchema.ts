import { z } from "zod";

export const updateBankAccountSchema = z.object({
  name: z.string().trim().min(1, "Nome da conta é obrigatório"),
  bank_name: z.string().trim().min(1, "Nome do banco é obrigatório"),
  account_number: z.string().trim().optional(),
});

export type UpdateBankAccountSchema = z.infer<typeof updateBankAccountSchema>;
