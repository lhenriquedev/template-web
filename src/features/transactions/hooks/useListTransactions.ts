import {
  TransactionService,
  type IListTransactionsFilters,
} from "@/services/TransactionService";
import { useQuery } from "@tanstack/react-query";

export function useListTransactions(filters: IListTransactionsFilters = {}) {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => TransactionService.listTransactions(filters),
    staleTime: 1000 * 60 * 2,
  });

  return {
    transactions: data?.data ?? [],
    pagination: data?.pagination,
    isPending,
    error,
    refetch,
  };
}
