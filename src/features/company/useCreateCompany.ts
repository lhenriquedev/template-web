import {
  CompanyService,
  type ICompanyResponse,
  type ICreateCompanyDTO,
} from "@/services/CompanyService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateCompany() {
  const queryClient = useQueryClient();

  const { mutateAsync: createCompany, isPending } = useMutation({
    mutationFn: (data: ICreateCompanyDTO) => CompanyService.createCompany(data),
    onMutate: async (newCompany, context) => {
      await queryClient.cancelQueries({ queryKey: ["companies"] });

      const previousCompanies =
        context.client.getQueryData<ICompanyResponse[]>(["companies"]);

      context.client.setQueryData(
        ["companies"],
        (old: ICompanyResponse[] = []) => [
          ...old,
          {
            id: crypto.randomUUID(),
            ...newCompany,
            created_at: new Date().toISOString(),
          },
        ]
      );

      return { previousCompanies };
    },
    onError: (_error, _variables, onMutateResult, context) => {
      context.client.setQueryData(
        ["companies"],
        onMutateResult?.previousCompanies
      );
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  return { createCompany, isPending };
}
