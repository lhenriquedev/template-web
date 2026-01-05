import {
  TransactionService,
  type ITransactionResponse,
} from "@/services/TransactionService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteTransaction, isPending } = useMutation({
    mutationFn: (id: string) => TransactionService.deleteTransaction(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      const previousTransactions = queryClient.getQueriesData({
        queryKey: ["transactions"],
      });

      queryClient.setQueriesData<{
        data: ITransactionResponse[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          total_pages: number;
        };
      }>({ queryKey: ["transactions"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((t) => t.id !== id),
          pagination: {
            ...old.pagination,
            total: old.pagination.total - 1,
          },
        };
      });

      return { previousTransactions };
    },
    onError: (_error, _id, context) => {
      if (context?.previousTransactions) {
        context.previousTransactions.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return { deleteTransaction, isPending };
}
