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
import type { ICompanyResponse } from "@/services/CompanyService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  updateCompanySchema,
  type UpdateCompanySchema,
} from "./updateCompanySchema";
import { useUpdateCompany } from "./useUpdateCompany";

interface ICompanyItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: ICompanyResponse | null;
}

export function CompanyItemDialog({
  isOpen,
  onClose,
  company,
}: ICompanyItemDialogProps) {
  const { updateCompany, isPending } = useUpdateCompany();

  const form = useForm<UpdateCompanySchema>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      name: company?.name ?? "",
      document: company?.document ?? "",
    },
  });

  useEffect(() => {
    if (company) {
      form.reset({ name: company.name, document: company.document });
    }
  }, [company, form]);

  const onSubmit = form.handleSubmit(async (data: UpdateCompanySchema) => {
    if (!company) return;

    try {
      await updateCompany({ id: company.id, data });
      onClose();
      toast.success("Empresa atualizada com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar empresa");
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar empresa</DialogTitle>
          <DialogDescription>
            Atualize as informações da empresa "{company?.name}".
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
            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
            Salvar alterações
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
