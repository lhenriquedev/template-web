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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListCompanies } from "@/features/company/useListCompanies";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createBankAccountSchema,
  type CreateBankAccountSchema,
} from "./createBankAccountSchema";
import { useCreateBankAccount } from "./useCreateBankAccount";

interface ICreateBankAccountFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateBankAccountForm({
  isOpen,
  onClose,
}: ICreateBankAccountFormProps) {
  const { createBankAccount, isPending } = useCreateBankAccount();
  const { companies } = useListCompanies();

  const form = useForm<CreateBankAccountSchema>({
    resolver: zodResolver(createBankAccountSchema),
    defaultValues: {
      name: "",
      bank_name: "",
      account_number: "",
      company_id: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data: CreateBankAccountSchema) => {
    try {
      await createBankAccount(data);
      onClose();
      form.reset();
      toast.success("Conta bancária criada com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar conta bancária");
      form.reset();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova conta bancária</DialogTitle>
          <DialogDescription>
            Adicione uma nova conta bancária vinculada a uma empresa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <Field>
                <FieldLabel>Nome da conta</FieldLabel>
                <Input
                  {...field}
                  placeholder="Ex: Conta Principal"
                  disabled={isPending}
                />
                <FieldError errors={[form.formState.errors.name]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="bank_name"
            render={({ field }) => (
              <Field>
                <FieldLabel>Nome do banco</FieldLabel>
                <Input
                  {...field}
                  placeholder="Ex: Banco do Brasil"
                  disabled={isPending}
                />
                <FieldError errors={[form.formState.errors.bank_name]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="account_number"
            render={({ field }) => (
              <Field>
                <FieldLabel>Número da conta (opcional)</FieldLabel>
                <Input
                  {...field}
                  placeholder="Ex: 12345-6"
                  disabled={isPending}
                />
                <FieldError errors={[form.formState.errors.account_number]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="company_id"
            render={({ field }) => (
              <Field>
                <FieldLabel>Empresa</FieldLabel>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>Selecione a empresa</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {companies?.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[form.formState.errors.company_id]} />
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
            Criar conta bancária
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
