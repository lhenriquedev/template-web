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
import type { ISubcategoryResponse } from "@/services/SubcategoryService";
import type { ISubsubcategoryResponse } from "@/services/SubsubcategoryService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  updateSubsubcategorySchema,
  type UpdateSubsubcategorySchema,
} from "./updateSubsubcategorySchema";
import { useUpdateSubsubcategory } from "./useUpdateSubsubcategory";

interface ISubsubcategoryItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subsubcategory: ISubsubcategoryResponse | null;
  subcategories: ISubcategoryResponse[];
}

export function SubsubcategoryItemDialog({
  isOpen,
  onClose,
  subsubcategory,
  subcategories,
}: ISubsubcategoryItemDialogProps) {
  const { updateSubsubcategory, isPending } = useUpdateSubsubcategory();

  const form = useForm<UpdateSubsubcategorySchema>({
    resolver: zodResolver(updateSubsubcategorySchema),
    defaultValues: {
      name: subsubcategory?.name || "",
      subCategoryId: subsubcategory?.subCategoryId || "",
    },
  });

  useEffect(() => {
    if (subsubcategory) {
      form.reset({
        name: subsubcategory.name,
        subCategoryId: subsubcategory.subCategoryId,
      });
    }
  }, [subsubcategory, form]);

  const onSubmit = form.handleSubmit(
    async (data: UpdateSubsubcategorySchema) => {
      if (!subsubcategory) return;

      try {
        await updateSubsubcategory({ id: subsubcategory.id, data });
        onClose();
        toast.success("Sub-subcategoria atualizada com sucesso");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao atualizar sub-subcategoria");
      }
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar sub-subcategoria</DialogTitle>
          <DialogDescription>
            Atualize as informações da sub-subcategoria "
            {subsubcategory?.name}".
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
                  placeholder="Digite o nome da sub-subcategoria"
                  disabled={isPending}
                />
                <FieldError errors={[form.formState.errors.name]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="subCategoryId"
            render={({ field }) => (
              <Field>
                <FieldLabel>Subcategoria</FieldLabel>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[form.formState.errors.subCategoryId]} />
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
