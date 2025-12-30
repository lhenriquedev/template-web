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
import type { ICategoryResponse } from "@/services/CategoryService";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createSubcategorySchema,
  type CreateSubcategorySchema,
} from "./createSubcategorySchema";
import { useCreateSubcategory } from "./useCreateSubcategory";

interface ICreateSubcategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ICategoryResponse[];
}

export function CreateSubcategoryForm({
  isOpen,
  onClose,
  categories,
}: ICreateSubcategoryFormProps) {
  const { createSubcategory, isPending } = useCreateSubcategory();

  const form = useForm<CreateSubcategorySchema>({
    resolver: zodResolver(createSubcategorySchema),
    defaultValues: {
      name: "",
      categoryId: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data: CreateSubcategorySchema) => {
    try {
      await createSubcategory(data);
      onClose();
      form.reset();
      toast.success("Subcategoria criada com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar subcategoria");
      form.reset();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova subcategoria</DialogTitle>
          <DialogDescription>
            Adicione uma nova subcategoria vinculada a uma categoria.
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
                  placeholder="Digite o nome da subcategoria"
                  disabled={isPending}
                />
                <FieldError errors={[form.formState.errors.name]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <Field>
                <FieldLabel>Categoria</FieldLabel>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[form.formState.errors.categoryId]} />
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
            Criar subcategoria
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
