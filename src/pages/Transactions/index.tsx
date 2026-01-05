import { Button } from "@/components/ui/button";
import { CreateTransactionForm } from "@/features/transactions/CreateTransactionForm";
import { TransactionFilters } from "@/features/transactions/TransactionFilters";
import { TransactionPagination } from "@/features/transactions/TransactionPagination";
import { TransactionTable } from "@/features/transactions/TransactionTable";
import { getTransactionColumns } from "@/features/transactions/data/columns";
import { useDeleteTransaction } from "@/features/transactions/hooks/useDeleteTransaction";
import { useListTransactions } from "@/features/transactions/hooks/useListTransactions";
import {
  type IListTransactionsFilters,
  type ITransactionResponse,
} from "@/services/TransactionService";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";

export default function TransactionsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filters, setFilters] = useState<IListTransactionsFilters>({
    page: 1,
    limit: 10,
    sort_by: "competence_date",
    sort_order: "desc",
  });

  const { transactions, pagination, isPending } = useListTransactions(filters);
  const { deleteTransaction } = useDeleteTransaction();

  const handleEdit = (transaction: ITransactionResponse) => {
    console.log("Edit transaction", transaction);
    toast.info("Funcionalidade de edição em desenvolvimento");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        await deleteTransaction(id);
        toast.success("Transação excluída com sucesso");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir transação");
      }
    }
  };

  const columns = getTransactionColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lançamentos</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          Nova Transação
        </Button>
      </div>

      <TransactionFilters filters={filters} onFiltersChange={setFilters} />

      {isPending ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <>
          <TransactionTable columns={columns} data={transactions} />

          {pagination && (
            <TransactionPagination
              page={pagination.page}
              limit={pagination.limit}
              total={pagination.total}
              totalPages={pagination.total_pages}
              onPageChange={(page) => setFilters({ ...filters, page })}
              onLimitChange={(limit) =>
                setFilters({ ...filters, limit, page: 1 })
              }
            />
          )}
        </>
      )}

      <CreateTransactionForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}
