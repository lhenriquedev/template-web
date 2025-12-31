import {
  BankAccountService,
  type IBankAccountResponse,
  type IUpdateBankAccountDTO,
} from "@/services/BankAccountService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateBankAccount() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateBankAccount, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateBankAccountDTO }) =>
      BankAccountService.updateBankAccount(id, data),
    onMutate: async ({ id, data }, context) => {
      await queryClient.cancelQueries({ queryKey: ["bank-accounts"] });

      const previousBankAccounts =
        context.client.getQueryData<IBankAccountResponse[]>(["bank-accounts"]);

      context.client.setQueryData(
        ["bank-accounts"],
        (old: IBankAccountResponse[] = []) =>
          old.map((bankAccount) =>
            bankAccount.id === id ? { ...bankAccount, ...data } : bankAccount
          )
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

  return { updateBankAccount, isPending };
}
