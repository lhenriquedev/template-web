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
import type { ISubsubcategoryResponse } from "@/services/SubsubcategoryService";
import { Folder03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";
import { useListSubcategories } from "../subcategory/useListSubcategories";
import { SubsubcategoryItem } from "./SubsubcategoryItem";
import { SubsubcategoryItemDialog } from "./SubsubcategoryItemDialog";
import { useDeleteSubsubcategory } from "./useDeleteSubsubcategory";
import { useListSubsubcategories } from "./useListSubsubcategories";

export function SubsubcategoryList() {
  const { subsubcategories, isPending, error } = useListSubsubcategories();
  const { subcategories } = useListSubcategories();
  const { deleteSubsubcategory, isPending: isDeleting } =
    useDeleteSubsubcategory();

  const [subsubcategoryBeingEdited, setSubsubcategoryBeingEdited] =
    useState<ISubsubcategoryResponse | null>(null);

  const [isSubsubcategoryItemDialogOpen, setIsSubsubcategoryItemDialogOpen] =
    useState(false);

  const [subsubcategoryToDelete, setSubsubcategoryToDelete] =
    useState<ISubsubcategoryResponse | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenSubsubcategoryItemDialog = (
    subsubcategory: ISubsubcategoryResponse
  ) => {
    setSubsubcategoryBeingEdited(subsubcategory);
    setIsSubsubcategoryItemDialogOpen(true);
  };

  const handleCloseSubsubcategoryItemDialog = () => {
    setIsSubsubcategoryItemDialogOpen(false);
    setSubsubcategoryBeingEdited(null);
  };

  const handleOpenDeleteDialog = (subsubcategory: ISubsubcategoryResponse) => {
    setSubsubcategoryToDelete(subsubcategory);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSubsubcategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!subsubcategoryToDelete) return;

    try {
      await deleteSubsubcategory(subsubcategoryToDelete.id);
      handleCloseDeleteDialog();
      toast.success("Sub-subcategoria deletada com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar sub-subcategoria");
    }
  };

  if (isPending) return <ItemSkeleton count={7} variant="outline" />;

  if (error) return <div>Error: {error.message}</div>;

  if (!subsubcategories || subsubcategories.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyContent>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={Folder03Icon} />
          </EmptyMedia>
          <EmptyTitle>Nenhuma sub-subcategoria encontrada</EmptyTitle>
          <EmptyDescription>
            Crie sub-subcategorias para um nível ainda mais detalhado de
            organização financeira.
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="space-y-4 p-4">
        {subsubcategories.map((subsubcategory) => (
          <SubsubcategoryItem
            key={subsubcategory.id}
            subsubcategory={subsubcategory}
            subcategories={subcategories || []}
            onOpenSubsubcategoryItemDialog={() =>
              handleOpenSubsubcategoryItemDialog(subsubcategory)
            }
            onDelete={() => handleOpenDeleteDialog(subsubcategory)}
          />
        ))}
      </div>

      {subsubcategoryBeingEdited && (
        <SubsubcategoryItemDialog
          isOpen={isSubsubcategoryItemDialogOpen}
          onClose={handleCloseSubsubcategoryItemDialog}
          subsubcategory={subsubcategoryBeingEdited}
          subcategories={subcategories || []}
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
              Tem certeza que deseja deletar a sub-subcategoria "
              {subsubcategoryToDelete?.name}"? Esta ação não pode ser desfeita.
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
