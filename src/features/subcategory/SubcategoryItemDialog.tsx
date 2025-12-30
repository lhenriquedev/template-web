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
import type { ISubcategoryResponse } from "@/services/SubcategoryService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  updateSubcategorySchema,
  type UpdateSubcategorySchema,
} from "./updateSubcategorySchema";
import { useUpdateSubcategory } from "./useUpdateSubcategory";

interface ISubcategoryItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subcategory: ISubcategoryResponse | null;
  categories: ICategoryResponse[];
}

export function SubcategoryItemDialog({
  isOpen,
  onClose,
  subcategory,
  categories,
}: ISubcategoryItemDialogProps) {
  const { updateSubcategory, isPending } = useUpdateSubcategory();

  const form = useForm<UpdateSubcategorySchema>({
    resolver: zodResolver(updateSubcategorySchema),
    defaultValues: {
      name: subcategory?.name || "",
      categoryId: subcategory?.categoryId || "",
    },
  });

  useEffect(() => {
    if (subcategory) {
      form.reset({
        name: subcategory.name,
        categoryId: subcategory.categoryId,
      });
    }
  }, [subcategory, form]);

  const onSubmit = form.handleSubmit(async (data: UpdateSubcategorySchema) => {
    if (!subcategory) return;

    try {
      await updateSubcategory({ id: subcategory.id, data });
      onClose();
      toast.success("Subcategoria atualizada com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar subcategoria");
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar subcategoria</DialogTitle>
          <DialogDescription>
            Atualize as informações da subcategoria "{subcategory?.name}".
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
            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
            Salvar alterações
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
