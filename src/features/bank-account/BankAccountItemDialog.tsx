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
import type { IBankAccountResponse } from "@/services/BankAccountService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  updateBankAccountSchema,
  type UpdateBankAccountSchema,
} from "./updateBankAccountSchema";
import { useUpdateBankAccount } from "./useUpdateBankAccount";

interface IBankAccountItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bankAccount: IBankAccountResponse | null;
}

export function BankAccountItemDialog({
  isOpen,
  onClose,
  bankAccount,
}: IBankAccountItemDialogProps) {
  const { updateBankAccount, isPending } = useUpdateBankAccount();

  const form = useForm<UpdateBankAccountSchema>({
    resolver: zodResolver(updateBankAccountSchema),
    defaultValues: {
      name: bankAccount?.name ?? "",
      bank_name: bankAccount?.bank_name ?? "",
      account_number: bankAccount?.account_number ?? "",
    },
  });

  useEffect(() => {
    if (bankAccount) {
      form.reset({
        name: bankAccount.name,
        bank_name: bankAccount.bank_name,
        account_number: bankAccount.account_number ?? "",
      });
    }
  }, [bankAccount, form]);

  const onSubmit = form.handleSubmit(async (data: UpdateBankAccountSchema) => {
    if (!bankAccount) return;

    try {
      await updateBankAccount({ id: bankAccount.id, data });
      onClose();
      toast.success("Conta bancária atualizada com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar conta bancária");
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar conta bancária</DialogTitle>
          <DialogDescription>
            Atualize as informações da conta "{bankAccount?.name}".
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
