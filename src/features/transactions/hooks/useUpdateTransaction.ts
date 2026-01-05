import {
  TransactionService,
  type IUpdateTransactionDTO,
  type ITransactionResponse,
} from "@/services/TransactionService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateTransaction, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateTransactionDTO }) =>
      TransactionService.updateTransaction(id, data),
    onMutate: async ({ id, data }) => {
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
          data: old.data.map((t) => (t.id === id ? { ...t, ...data } : t)),
        };
      });

      return { previousTransactions };
    },
    onError: (_error, _variables, context) => {
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

  return { updateTransaction, isPending };
}
