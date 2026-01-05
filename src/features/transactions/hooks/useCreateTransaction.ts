import {
  TransactionService,
  type ICreateTransactionDTO,
  type ITransactionResponse,
} from "@/services/TransactionService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  const { mutateAsync: createTransaction, isPending } = useMutation({
    mutationFn: (transaction: ICreateTransactionDTO) =>
      TransactionService.createTransaction(transaction),
    onMutate: async (newTransaction) => {
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
          data: [newTransaction as unknown as ITransactionResponse, ...old.data],
          pagination: {
            ...old.pagination,
            total: old.pagination.total + 1,
          },
        };
      });

      return { previousTransactions };
    },
    onError: (_error, _newTransaction, context) => {
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

  return { createTransaction, isPending };
}
