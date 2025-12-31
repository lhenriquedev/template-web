import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createCompanySchema,
  type CreateCompanySchema,
} from "./createCompanySchema";
import { useCreateCompany } from "./useCreateCompany";

interface ICreateCompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCompanyForm({
  isOpen,
  onClose,
}: ICreateCompanyFormProps) {
  const { createCompany, isPending } = useCreateCompany();

  const form = useForm<CreateCompanySchema>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      document: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data: CreateCompanySchema) => {
    try {
      await createCompany(data);
      onClose();
      form.reset();
      toast.success("Empresa criada com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar empresa");
      form.reset();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova empresa</DialogTitle>
          <DialogDescription>
            Adicione uma nova empresa para gerenciar suas transações.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <Field>
                <FieldLabel>Nome</FieldLabel>
                <Input
                  {...field}
                  placeholder="Digite o nome da empresa"
                  disabled={isPending}
                />
                <FieldError errors={[form.formState.errors.name]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="document"
            render={({ field }) => (
              <Field>
                <FieldLabel>Documento</FieldLabel>
                <Input
                  {...field}
                  placeholder="Digite o documento (CNPJ/CPF)"
                  disabled={isPending}
                />
                <FieldError errors={[form.formState.errors.document]} />
              </Field>
            )}
          />
        </form>

        <DialogFooter>
          <DialogClose
            render={
              <Button size="lg" variant="outline">
                Cancelar
              </Button>
            }
          />
          <LoadingButton
            size="lg"
            onClick={onSubmit}
            isLoading={isPending}
            disabled={isPending}
          >
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
            Criar empresa
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
