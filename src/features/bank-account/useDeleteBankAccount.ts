import {
  BankAccountService,
  type IBankAccountResponse,
} from "@/services/BankAccountService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteBankAccount() {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteBankAccount, isPending } = useMutation({
    mutationFn: (id: string) => BankAccountService.deleteBankAccount(id),
    onMutate: async (id, context) => {
      await queryClient.cancelQueries({ queryKey: ["bank-accounts"] });

      const previousBankAccounts =
        context.client.getQueryData<IBankAccountResponse[]>(["bank-accounts"]);

      context.client.setQueryData(
        ["bank-accounts"],
        (old: IBankAccountResponse[] = []) =>
          old.filter((bankAccount) => bankAccount.id !== id)
      );

      return { previousBankAccounts };
    },
    onError: (_error, _id, onMutateResult, context) => {
      context.client.setQueryData(
        ["bank-accounts"],
        onMutateResult?.previousBankAccounts
      );
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["bank-accounts"] });
    },
  });

  return { deleteBankAccount, isPending };
}
