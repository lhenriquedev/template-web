import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useFormContext } from "react-hook-form";

interface CreatePaymentFormProps {
  onSubmit: () => void;
}

export function CreatePaymentForm({ onSubmit }: CreatePaymentFormProps) {
  const form = useFormContext();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <Field>
            <FieldLabel>Descrição</FieldLabel>
            <Input {...field} placeholder="Digite a descrição do pagamento" />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="amount"
        render={({ field }) => (
          <Field>
            <FieldLabel>Valor</FieldLabel>
            <Input {...field} type="number" step="0.01" placeholder="0.00" />
            <FieldError errors={[form.formState.errors.amount]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <Field>
            <FieldLabel>Categoria</FieldLabel>
            <Select {...field}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Salário</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={[form.formState.errors.categoryId]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="type"
        render={({ field }) => (
          <Field>
            <FieldLabel>Tipo</FieldLabel>
            <Select {...field}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={[form.formState.errors.type]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="date"
        render={({ field }) => (
          <Field>
            <FieldLabel>Data</FieldLabel>
            <Input
              {...field}
              type="date"
              value={
                field.value instanceof Date
                  ? field.value.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => field.onChange(new Date(e.target.value))}
            />
            <FieldError errors={[form.formState.errors.date]} />
          </Field>
        )}
      />
    </form>
  );
}
