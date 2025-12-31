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
import type { ICompanyResponse } from "@/services/CompanyService";
import { Building02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";
import { CompanyItem } from "./CompanyItem";
import { CompanyItemDialog } from "./CompanyItemDialog";
import { useDeleteCompany } from "./useDeleteCompany";
import { useListCompanies } from "./useListCompanies";

export function CompanyList() {
  const { companies, isPending, error } = useListCompanies();
  const { deleteCompany, isPending: isDeleting } = useDeleteCompany();

  const [companyBeingEdited, setCompanyBeingEdited] =
    useState<ICompanyResponse | null>(null);

  const [isCompanyItemDialogOpen, setIsCompanyItemDialogOpen] = useState(false);

  const [companyToDelete, setCompanyToDelete] =
    useState<ICompanyResponse | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenCompanyItemDialog = (company: ICompanyResponse) => {
    setCompanyBeingEdited(company);
    setIsCompanyItemDialogOpen(true);
  };

  const handleCloseCompanyItemDialog = () => {
    setIsCompanyItemDialogOpen(false);
    setCompanyBeingEdited(null);
  };

  const handleOpenDeleteDialog = (company: ICompanyResponse) => {
    setCompanyToDelete(company);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCompanyToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;

    try {
      await deleteCompany(companyToDelete.id);
      handleCloseDeleteDialog();
      toast.success("Empresa deletada com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar empresa");
    }
  };

  if (isPending) return <ItemSkeleton count={7} variant="outline" />;

  if (error) return <div>Error: {error.message}</div>;

  if (!companies || companies.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyContent>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={Building02Icon} />
          </EmptyMedia>
          <EmptyTitle>Nenhuma empresa encontrada</EmptyTitle>
          <EmptyDescription>
            Comece criando sua primeira empresa para gerenciar suas transações.
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="space-y-4 p-4">
        {companies.map((company) => (
          <CompanyItem
            key={company.id}
            company={company}
            onOpenCompanyItemDialog={() =>
              handleOpenCompanyItemDialog(company)
            }
            onDelete={() => handleOpenDeleteDialog(company)}
          />
        ))}
      </div>

      {companyBeingEdited && (
        <CompanyItemDialog
          isOpen={isCompanyItemDialogOpen}
          onClose={handleCloseCompanyItemDialog}
          company={companyBeingEdited}
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
              Tem certeza que deseja deletar a empresa "
              {companyToDelete?.name}"? Esta ação não pode ser desfeita.
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
