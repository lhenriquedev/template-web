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
import { useListCompanies } from "@/features/company/useListCompanies";
import type { IBankAccountResponse } from "@/services/BankAccountService";
import { BankIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";
import { BankAccountItem } from "./BankAccountItem";
import { BankAccountItemDialog } from "./BankAccountItemDialog";
import { useDeleteBankAccount } from "./useDeleteBankAccount";
import { useListBankAccounts } from "./useListBankAccounts";

export function BankAccountList() {
  const { bankAccounts, isPending, error } = useListBankAccounts();
  const { companies } = useListCompanies();
  const { deleteBankAccount, isPending: isDeleting } = useDeleteBankAccount();

  const [bankAccountBeingEdited, setBankAccountBeingEdited] =
    useState<IBankAccountResponse | null>(null);

  const [isBankAccountItemDialogOpen, setIsBankAccountItemDialogOpen] =
    useState(false);

  const [bankAccountToDelete, setBankAccountToDelete] =
    useState<IBankAccountResponse | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenBankAccountItemDialog = (
    bankAccount: IBankAccountResponse
  ) => {
    setBankAccountBeingEdited(bankAccount);
    setIsBankAccountItemDialogOpen(true);
  };

  const handleCloseBankAccountItemDialog = () => {
    setIsBankAccountItemDialogOpen(false);
    setBankAccountBeingEdited(null);
  };

  const handleOpenDeleteDialog = (bankAccount: IBankAccountResponse) => {
    setBankAccountToDelete(bankAccount);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setBankAccountToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!bankAccountToDelete) return;

    try {
      await deleteBankAccount(bankAccountToDelete.id);
      handleCloseDeleteDialog();
      toast.success("Conta bancária deletada com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar conta bancária");
    }
  };

  const getCompanyName = (companyId: string) => {
    return companies?.find((company) => company.id === companyId)?.name;
  };

  if (isPending) return <ItemSkeleton count={7} variant="outline" />;

  if (error) return <div>Error: {error.message}</div>;

  if (!bankAccounts || bankAccounts.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyContent>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={BankIcon} />
          </EmptyMedia>
          <EmptyTitle>Nenhuma conta bancária encontrada</EmptyTitle>
          <EmptyDescription>
            Comece criando sua primeira conta bancária para gerenciar suas
            transações.
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="space-y-4 p-4">
        {bankAccounts.map((bankAccount) => (
          <BankAccountItem
            key={bankAccount.id}
            bankAccount={bankAccount}
            companyName={getCompanyName(bankAccount.company_id)}
            onOpenBankAccountItemDialog={() =>
              handleOpenBankAccountItemDialog(bankAccount)
            }
            onDelete={() => handleOpenDeleteDialog(bankAccount)}
          />
        ))}
      </div>

      {bankAccountBeingEdited && (
        <BankAccountItemDialog
          isOpen={isBankAccountItemDialogOpen}
          onClose={handleCloseBankAccountItemDialog}
          bankAccount={bankAccountBeingEdited}
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
              Tem certeza que deseja deletar a conta bancária "
              {bankAccountToDelete?.name}"? Esta ação não pode ser desfeita.
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
