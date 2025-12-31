import {
  BankAccountService,
  type IBankAccountResponse,
  type ICreateBankAccountDTO,
} from "@/services/BankAccountService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateBankAccount() {
  const queryClient = useQueryClient();

  const { mutateAsync: createBankAccount, isPending } = useMutation({
    mutationFn: (data: ICreateBankAccountDTO) =>
      BankAccountService.createBankAccount(data),
    onMutate: async (newBankAccount, context) => {
      await queryClient.cancelQueries({ queryKey: ["bank-accounts"] });

      const previousBankAccounts =
        context.client.getQueryData<IBankAccountResponse[]>(["bank-accounts"]);

      context.client.setQueryData(
        ["bank-accounts"],
        (old: IBankAccountResponse[] = []) => [
          ...old,
          {
            id: crypto.randomUUID(),
            ...newBankAccount,
            account_number: newBankAccount.account_number ?? null,
            initial_balance: 0,
            current_balance: 0,
            created_at: new Date().toISOString(),
          },
        ]
      );

      return { previousBankAccounts };
    },
    onError: (_error, _variables, onMutateResult, context) => {
      context.client.setQueryData(
        ["bank-accounts"],
        onMutateResult?.previousBankAccounts
      );
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["bank-accounts"] });
    },
  });

  return { createBankAccount, isPending };
}
