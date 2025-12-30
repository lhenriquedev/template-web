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
import { CreatePaymentForm } from "./CreatePaymentForm";
import { createPaymentSchema, type CreatePaymentSchema } from "./data/schema";

export function CreatePaymentDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreatePaymentSchema>({
    resolver: zodResolver(createPaymentSchema),
  });

  const onSubmit = form.handleSubmit((data: CreatePaymentSchema) => {
    console.log(data);
    setIsOpen(false);
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button size="lg" variant="default">
            Novo método de pagamento
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo método de pagamento</DialogTitle>
          <DialogDescription>
            Adicione um novo método de pagamento.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <CreatePaymentForm onSubmit={onSubmit} />
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
            Adicionar pagamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
