import { z } from "zod";

export const createBankAccountSchema = z.object({
  name: z.string().trim().min(1, "Nome da conta é obrigatório"),
  bank_name: z.string().trim().min(1, "Nome do banco é obrigatório"),
  account_number: z.string().trim().optional(),
  company_id: z.string().uuid("Selecione uma empresa"),
});

export type CreateBankAccountSchema = z.infer<typeof createBankAccountSchema>;
