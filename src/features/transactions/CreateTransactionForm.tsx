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
import { Textarea } from "@/components/ui/textarea";
import { useListBankAccounts } from "@/features/bank-account/useListBankAccounts";
import { useListCategories } from "@/features/category/useListCategories";
import { useListCompanies } from "@/features/company/useListCompanies";
import { useListSubcategories } from "@/features/subcategory/useListSubcategories";
import { useListSubsubcategories } from "@/features/subsubcategory/useListSubsubcategories";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createTransactionSchema,
  type CreateTransactionSchema,
} from "./data/schema";
import { useCreateTransaction } from "./hooks/useCreateTransaction";

interface ICreateTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTransactionForm({
  isOpen,
  onClose,
}: ICreateTransactionFormProps) {
  const { createTransaction, isPending } = useCreateTransaction();
  const { companies, isPending: loadingCompanies } = useListCompanies();
  const { bankAccounts, isPending: loadingBankAccounts } =
    useListBankAccounts();
  const { categories, isPending: loadingCategories } = useListCategories();
  const { subcategories: allSubcategories } = useListSubcategories();
  const { subsubcategories: allSubsubcategories } = useListSubsubcategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");

  const subcategories =
    allSubcategories?.filter((s) => s.category_id === selectedCategoryId) || [];

  const subsubcategories =
    allSubsubcategories?.filter(
      (s) => s.subcategory_id === selectedSubcategoryId
    ) || [];

  const form = useForm<CreateTransactionSchema>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      competence_date: undefined,
      cash_date: undefined,
      amount: 0,
      bank_account_id: "",
      company_id: "",
      category_id: "",
      subcategory_id: undefined,
      sub_subcategory_id: undefined,
      observation: "",
      invoice_number: "",
      supplier: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        competence_date: data.competence_date.toISOString(),
        cash_date: data.cash_date.toISOString(),
      };

      await createTransaction(payload);
      onClose();
      form.reset();
      setSelectedCategoryId("");
      setSelectedSubcategoryId("");
      toast.success("Transação criada com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar transação");
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Registre uma nova transação financeira no sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="competence_date"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Data de Competência</FieldLabel>
                  <Input
                    type="date"
                    value={
                      field.value ? field.value.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : undefined
                      )
                    }
                    disabled={isPending}
                  />
                  <FieldError
                    errors={[form.formState.errors.competence_date]}
                  />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="cash_date"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Data de Caixa</FieldLabel>
                  <Input
                    type="date"
                    value={
                      field.value ? field.value.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : undefined
                      )
                    }
                    disabled={isPending}
                  />
                  <FieldError errors={[form.formState.errors.cash_date]} />
                </Field>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="amount"
            render={({ field }) => (
              <Field>
                <FieldLabel>Valor</FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  placeholder="0,00"
                  disabled={isPending}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
                <FieldError errors={[form.formState.errors.amount]} />
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="company_id"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Empresa</FieldLabel>
                  <Select
                    value={field.value || null}
                    onValueChange={field.onChange}
                    disabled={isPending || loadingCompanies}
                    items={companies?.map((company) => ({
                      label: company.name,
                      value: company.id,
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
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

            <Controller
              control={form.control}
              name="bank_account_id"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Conta Bancária</FieldLabel>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    disabled={isPending || loadingBankAccounts}
                    items={bankAccounts?.map((account) => ({
                      label: `${account.name} - ${account.bank_name}`,
                      value: account.id,
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts?.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} - {account.bank_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    errors={[form.formState.errors.bank_account_id]}
                  />
                </Field>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <Field>
                <FieldLabel>Categoria</FieldLabel>
                <Select
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedCategoryId(value || "");
                    form.setValue("subcategory_id", undefined);
                    form.setValue("sub_subcategory_id", undefined);
                    setSelectedSubcategoryId("");
                  }}
                  disabled={isPending || loadingCategories}
                  items={categories?.map((category) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[form.formState.errors.category_id]} />
              </Field>
            )}
          />

          {selectedCategoryId && (
            <Controller
              control={form.control}
              name="subcategory_id"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Subcategoria (Opcional)</FieldLabel>
                  <Select
                    {...field}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedSubcategoryId(value || "");
                      form.setValue("sub_subcategory_id", undefined);
                    }}
                    disabled={isPending}
                    items={subcategories.map((subcategory) => ({
                      label: subcategory.name,
                      value: subcategory.id,
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[form.formState.errors.subcategory_id]} />
                </Field>
              )}
            />
          )}

          {selectedSubcategoryId && (
            <Controller
              control={form.control}
              name="sub_subcategory_id"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Sub-subcategoria (Opcional)</FieldLabel>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    disabled={isPending}
                    items={subsubcategories.map((subsubcategory) => ({
                      label: subsubcategory.name,
                      value: subsubcategory.id,
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subsubcategories.map((subsubcategory) => (
                        <SelectItem
                          key={subsubcategory.id}
                          value={subsubcategory.id}
                        >
                          {subsubcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    errors={[form.formState.errors.sub_subcategory_id]}
                  />
                </Field>
              )}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Fornecedor (Opcional)</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Nome do fornecedor"
                    disabled={isPending}
                  />
                  <FieldError errors={[form.formState.errors.supplier]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="invoice_number"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Nota Fiscal (Opcional)</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Número da nota fiscal"
                    disabled={isPending}
                  />
                  <FieldError errors={[form.formState.errors.invoice_number]} />
                </Field>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="observation"
            render={({ field }) => (
              <Field>
                <FieldLabel>Observação (Opcional)</FieldLabel>
                <Textarea
                  {...field}
                  placeholder="Observações adicionais..."
                  disabled={isPending}
                  rows={3}
                />
                <FieldError errors={[form.formState.errors.observation]} />
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
            Criar Transação
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
