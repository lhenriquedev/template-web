import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useFormContext } from "react-hook-form";

interface ICreateTransactionFormProps {
  onSubmit: () => void;
}

export function CreateTransactionForm({
  onSubmit,
}: ICreateTransactionFormProps) {
  const form = useFormContext();

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={form.control}
          name="competenceDate"
          render={({ field }) => (
            <Field>
              <FieldLabel>Data Competência</FieldLabel>
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
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="cashDate"
          render={({ field }) => (
            <Field>
              <FieldLabel>Data Caixa</FieldLabel>
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
            </Field>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={form.control}
          name="planned"
          render={({ field }) => (
            <Field>
              <FieldLabel>Previsto (opcional)</FieldLabel>
              <Input
                {...field}
                type="number"
                step="0.01"
                placeholder="0.00"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="actual"
          render={({ field }) => (
            <Field>
              <FieldLabel>Realizado (opcional)</FieldLabel>
              <Input
                {...field}
                type="number"
                step="0.01"
                placeholder="0.00"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
            </Field>
          )}
        />
      </div>

      <Controller
        control={form.control}
        name="account"
        render={({ field }) => (
          <Field>
            <FieldLabel>Conta</FieldLabel>
            <Select {...field}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sicredi BPR02">Sicredi BPR02</SelectItem>
                <SelectItem value="Sicredi BPR03">Sicredi BPR03</SelectItem>
                <SelectItem value="Sicredi INDE07">Sicredi INDE07</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={[form.formState.errors.account]} />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="businessUnit"
        render={({ field }) => (
          <Field>
            <FieldLabel>Unidade de Negócio</FieldLabel>
            <Select {...field}>
              <SelectTrigger>
                <SelectValue>Selecione uma unidade</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BPR02">BPR02</SelectItem>
                <SelectItem value="BPR03">BPR03</SelectItem>
                <SelectItem value="INDE07">INDE07</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="category"
        render={({ field }) => (
          <Field>
            <FieldLabel>Categoria</FieldLabel>
            <Select {...field}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Desp. Operacionais">
                  Desp. Operacionais
                </SelectItem>
                <SelectItem value="Receitas">Receitas</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="level1"
        render={({ field }) => (
          <Field>
            <FieldLabel>Nível 1</FieldLabel>
            <Select {...field}>
              <SelectTrigger>
                <SelectValue>Selecione o nível 1</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Serviços Terceirizados">
                  Serviços Terceirizados
                </SelectItem>
                <SelectItem value="Despesas Administrativas">
                  Despesas Administrativas
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="level2"
        render={({ field }) => (
          <Field>
            <FieldLabel>Nível 2 (opcional)</FieldLabel>
            <Input
              {...field}
              value={field.value ?? ""}
              placeholder="Digite o nível 2"
            />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="observation"
        render={({ field }) => (
          <Field>
            <FieldLabel>Observação (opcional)</FieldLabel>
            <Textarea
              {...field}
              value={field.value ?? ""}
              placeholder="Digite observações adicionais"
              rows={4}
            />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="invoice"
        render={({ field }) => (
          <Field>
            <FieldLabel>NF (opcional)</FieldLabel>
            <Input
              {...field}
              value={field.value ?? ""}
              placeholder="Número da nota fiscal ou 'Sem NF'"
            />
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="supplier"
        render={({ field }) => (
          <Field>
            <FieldLabel>Fornecedor/Favorecido</FieldLabel>
            <Input {...field} placeholder="Digite o nome do fornecedor" />
          </Field>
        )}
      />
    </form>
  );
}
