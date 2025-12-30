import { z } from "zod";

export const invoiceEntrySchema = z.object({
  competenceDate: z.date(),
});

export type InvoiceEntrySchema = z.infer<typeof invoiceEntrySchema>;
