import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CreateTransactionForm } from "./CreateTransactionForm";
import { invoiceEntrySchema, type InvoiceEntrySchema } from "./data/schema";

export function CreateInvoiceDialog() {
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] =
    useState(false);

  const form = useForm<InvoiceEntrySchema>({
    resolver: zodResolver(invoiceEntrySchema),
  });

  const onSubmit = form.handleSubmit((data: InvoiceEntrySchema) => {
    console.log(data);
  });

  return (
    <Dialog
      open={isCreateInvoiceDialogOpen}
      onOpenChange={setIsCreateInvoiceDialogOpen}
    >
      <DialogTrigger
        render={
          <Button size="lg" variant="default">
            Criar lançamento
          </Button>
        }
      />
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo lançamento</DialogTitle>
          <DialogDescription>
            Preencha os dados do lançamento financeiro abaixo.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <CreateTransactionForm onSubmit={onSubmit} />
        </FormProvider>

        <DialogFooter>
          <DialogClose
            render={
              <Button size="lg" variant="outline">
                Cancelar
              </Button>
            }
          />
          <Button size="lg" onClick={onSubmit}>
            Salvar lançamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
