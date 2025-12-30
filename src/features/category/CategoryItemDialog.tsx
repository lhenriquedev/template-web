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
import type { ICategoryResponse } from "@/services/CategoryService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  updateCategorySchema,
  type UpdateCategorySchema,
} from "./updateCategorySchema";
import { useUpdateCategory } from "./useUpdateCategory";

interface ICategoryItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: ICategoryResponse | null;
}

export function CategoryItemDialog({
  isOpen,
  onClose,
  category,
}: ICategoryItemDialogProps) {
  const { updateCategory, isPending } = useUpdateCategory();

  const form = useForm<UpdateCategorySchema>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category?.name || "",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({ name: category.name });
    }
  }, [category, form]);

  const onSubmit = form.handleSubmit(async (data: UpdateCategorySchema) => {
    if (!category) return;

    try {
      await updateCategory({ id: category.id, data });
      onClose();
      toast.success("Categoria atualizada com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar categoria");
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar categoria</DialogTitle>
          <DialogDescription>
            Atualize as informações da categoria "{category?.name}".
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
                  placeholder="Digite o nome da categoria"
                  disabled={isPending}
                />
                <FieldError errors={[form.formState.errors.name]} />
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
