import { z } from "zod";

export const createPaymentSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.coerce.number().positive("Valor deve ser positivo"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  date: z.date(),
  type: z.enum(["income", "expense"]),
});

export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>;
