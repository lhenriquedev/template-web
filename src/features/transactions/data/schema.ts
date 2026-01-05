import { z } from "zod";

export const createTransactionSchema = z
  .object({
    competence_date: z.coerce.date(),
    cash_date: z.coerce.date(),
    amount: z.number().positive("O valor deve ser maior que 0"),
    bank_account_id: z.uuid("ID de conta bancária inválido"),
    company_id: z.uuid("ID de empresa inválido"),
    category_id: z.uuid("ID de categoria inválido"),
    subcategory_id: z.uuid("ID de subcategoria inválido").optional(),
    sub_subcategory_id: z.uuid("ID de sub-subcategoria inválido").optional(),
    observation: z.string().max(500, "Observação muito longa").optional(),
    invoice_number: z
      .string()
      .max(100, "Número de nota muito longo")
      .optional(),
    supplier: z.string().max(255, "Nome de fornecedor muito longo").optional(),
  })
  .refine(
    (data) => {
      if (data.sub_subcategory_id && !data.subcategory_id) {
        return false;
      }
      return true;
    },
    {
      message:
        "Se sub-subcategoria for fornecida, a subcategoria também deve ser informada",
      path: ["subcategory_id"],
    }
  );

export const updateTransactionSchema = z.object({
  competence_date: z.date().optional(),
  cash_date: z.date().optional(),
  amount: z.coerce.number().positive("O valor deve ser maior que 0").optional(),
  bank_account_id: z.uuid().optional(),
  company_id: z.uuid().optional(),
  category_id: z.uuid().optional(),
  subcategory_id: z.uuid().optional().nullable(),
  sub_subcategory_id: z.uuid().optional().nullable(),
  observation: z
    .string()
    .max(500, "Observação muito longa")
    .optional()
    .nullable(),
  invoice_number: z
    .string()
    .max(100, "Número de nota muito longo")
    .optional()
    .nullable(),
  supplier: z
    .string()
    .max(255, "Nome de fornecedor muito longo")
    .optional()
    .nullable(),
});

export const transactionFiltersSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  company_id: z.uuid().optional(),
  bank_account_id: z.uuid().optional(),
  category_id: z.uuid().optional(),
  subcategory_id: z.uuid().optional(),
  sub_subcategory_id: z.uuid().optional(),
  competence_date_start: z.date().optional(),
  competence_date_end: z.date().optional(),
  cash_date_start: z.date().optional(),
  cash_date_end: z.date().optional(),
  sort_by: z
    .enum(["competence_date", "cash_date", "amount", "created_at"])
    .default("competence_date"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionSchema = z.infer<typeof updateTransactionSchema>;
export type TransactionFiltersSchema = z.infer<typeof transactionFiltersSchema>;
