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
import type { ICategoryResponse } from "@/services/CategoryService";
import { FolderAddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";
import { CategoryItem } from "./CategoryItem";
import { CategoryItemDialog } from "./CategoryItemDialog";
import { useDeleteCategory } from "./useDeleteCategory";
import { useListCategories } from "./useListCategories";

export function CategoryList() {
  const { categories, isPending, error } = useListCategories();
  const { deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [categoryBeingEdited, setCategoryBeingEdited] =
    useState<ICategoryResponse | null>(null);

  const [isCategoryItemDialogOpen, setIsCategoryItemDialogOpen] =
    useState(false);

  const [categoryToDelete, setCategoryToDelete] =
    useState<ICategoryResponse | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenCategoryItemDialog = (category: ICategoryResponse) => {
    setCategoryBeingEdited(category);
    setIsCategoryItemDialogOpen(true);
  };

  const handleCloseCategoryItemDialog = () => {
    setIsCategoryItemDialogOpen(false);
    setCategoryBeingEdited(null);
  };

  const handleOpenDeleteDialog = (category: ICategoryResponse) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      handleCloseDeleteDialog();
      toast.success("Categoria deletada com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar categoria");
    }
  };

  if (isPending) return <ItemSkeleton count={7} variant="outline" />;

  if (error) return <div>Error: {error.message}</div>;

  if (!categories || categories.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyContent>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={FolderAddIcon} />
          </EmptyMedia>
          <EmptyTitle>Nenhuma categoria encontrada</EmptyTitle>
          <EmptyDescription>
            Comece criando sua primeira categoria para organizar suas transações
            financeiras.
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="space-y-4 p-4">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            onOpenCategoryItemDialog={() =>
              handleOpenCategoryItemDialog(category)
            }
            onDelete={() => handleOpenDeleteDialog(category)}
          />
        ))}
      </div>

      {categoryBeingEdited && (
        <CategoryItemDialog
          isOpen={isCategoryItemDialogOpen}
          onClose={handleCloseCategoryItemDialog}
          category={categoryBeingEdited}
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
              Tem certeza que deseja deletar a categoria "
              {categoryToDelete?.name}"? Esta ação não pode ser desfeita.
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
