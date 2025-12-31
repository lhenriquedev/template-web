import {
  CompanyService,
  type ICompanyResponse,
  type IUpdateCompanyDTO,
} from "@/services/CompanyService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateCompany, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateCompanyDTO }) =>
      CompanyService.updateCompany(id, data),
    onMutate: async ({ id, data }, context) => {
      await queryClient.cancelQueries({ queryKey: ["companies"] });

      const previousCompanies =
        context.client.getQueryData<ICompanyResponse[]>(["companies"]);

      context.client.setQueryData(
        ["companies"],
        (old: ICompanyResponse[] = []) =>
          old.map((company) =>
            company.id === id ? { ...company, ...data } : company
          )
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

  return { updateCompany, isPending };
}
