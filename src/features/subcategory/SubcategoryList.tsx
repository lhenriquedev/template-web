import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ItemSkeleton } from "@/components/ui/item-skeleton";
import { LoadingButton } from "@/components/ui/loading-button";
import type { ISubcategoryResponse } from "@/services/SubcategoryService";
import { Folder02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";
import { useListCategories } from "../category/useListCategories";
import { SubcategoryItem } from "./SubcategoryItem";
import { SubcategoryItemDialog } from "./SubcategoryItemDialog";
import { useDeleteSubcategory } from "./useDeleteSubcategory";
import { useListSubcategories } from "./useListSubcategories";

export function SubcategoryList() {
  const { subcategories, isPending, error } = useListSubcategories();
  const { categories } = useListCategories();
  const { deleteSubcategory, isPending: isDeleting } = useDeleteSubcategory();

  const [subcategoryBeingEdited, setSubcategoryBeingEdited] =
    useState<ISubcategoryResponse | null>(null);

  const [isSubcategoryItemDialogOpen, setIsSubcategoryItemDialogOpen] =
    useState(false);

  const [subcategoryToDelete, setSubcategoryToDelete] =
    useState<ISubcategoryResponse | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenSubcategoryItemDialog = (
    subcategory: ISubcategoryResponse
  ) => {
    setSubcategoryBeingEdited(subcategory);
    setIsSubcategoryItemDialogOpen(true);
  };

  const handleCloseSubcategoryItemDialog = () => {
    setIsSubcategoryItemDialogOpen(false);
    setSubcategoryBeingEdited(null);
  };

  const handleOpenDeleteDialog = (subcategory: ISubcategoryResponse) => {
    setSubcategoryToDelete(subcategory);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSubcategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!subcategoryToDelete) return;

    try {
      await deleteSubcategory(subcategoryToDelete.id);
      handleCloseDeleteDialog();
      toast.success("Subcategoria deletada com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar subcategoria");
    }
  };

  if (isPending) return <ItemSkeleton count={7} variant="outline" />;

  if (error) return <div>Error: {error.message}</div>;

  if (!subcategories || subcategories.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyContent>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={Folder02Icon} />
          </EmptyMedia>
          <EmptyTitle>Nenhuma subcategoria encontrada</EmptyTitle>
          <EmptyDescription>
            Crie subcategorias para organizar melhor suas categorias
            financeiras.
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="space-y-4 p-4">
        {subcategories.map((subcategory) => (
          <SubcategoryItem
            key={subcategory.id}
            subcategory={subcategory}
            categories={categories || []}
            onOpenSubcategoryItemDialog={() =>
              handleOpenSubcategoryItemDialog(subcategory)
            }
            onDelete={() => handleOpenDeleteDialog(subcategory)}
          />
        ))}
      </div>

      {subcategoryBeingEdited && (
        <SubcategoryItemDialog
          isOpen={isSubcategoryItemDialogOpen}
          onClose={handleCloseSubcategoryItemDialog}
          subcategory={subcategoryBeingEdited}
          categories={categories || []}
        />
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a subcategoria "
              {subcategoryToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>
              Cancelar
            </AlertDialogCancel>
            <LoadingButton
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              disabled={isDeleting}
              variant="destructive"
            >
              Deletar
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
