import { BankAccountService } from "@/services/BankAccountService";
import { useQuery } from "@tanstack/react-query";

export function useListBankAccounts() {
  const { data, isPending, error } = useQuery({
    queryKey: ["bank-accounts"],
    queryFn: () => BankAccountService.listBankAccounts(),
    staleTime: 1000 * 60 * 5,
  });

  return { bankAccounts: data, isPending, error };
}
