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
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createSubsubcategorySchema,
  type CreateSubsubcategorySchema,
} from "./createSubsubcategorySchema";
import { useCreateSubsubcategory } from "./useCreateSubsubcategory";

interface ICreateSubsubcategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  subcategories: ISubcategoryResponse[];
}

export function CreateSubsubcategoryForm({
  isOpen,
  onClose,
  subcategories,
}: ICreateSubsubcategoryFormProps) {
  const { createSubsubcategory, isPending } = useCreateSubsubcategory();

  const form = useForm<CreateSubsubcategorySchema>({
    resolver: zodResolver(createSubsubcategorySchema),
    defaultValues: {
      name: "",
      subCategoryId: "",
    },
  });

  const onSubmit = form.handleSubmit(
    async (data: CreateSubsubcategorySchema) => {
      try {
        await createSubsubcategory(data);
        onClose();
        form.reset();
        toast.success("Sub-subcategoria criada com sucesso");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao criar sub-subcategoria");
        form.reset();
      }
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova sub-subcategoria</DialogTitle>
          <DialogDescription>
            Adicione uma nova sub-subcategoria vinculada a uma subcategoria.
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
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
            Criar sub-subcategoria
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
