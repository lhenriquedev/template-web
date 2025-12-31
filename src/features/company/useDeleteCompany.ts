import {
  CompanyService,
  type ICompanyResponse,
} from "@/services/CompanyService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteCompany, isPending } = useMutation({
    mutationFn: (id: string) => CompanyService.deleteCompany(id),
    onMutate: async (id, context) => {
      await queryClient.cancelQueries({ queryKey: ["companies"] });

      const previousCompanies =
        context.client.getQueryData<ICompanyResponse[]>(["companies"]);

      context.client.setQueryData(
        ["companies"],
        (old: ICompanyResponse[] = []) =>
          old.filter((company) => company.id !== id)
      );

      return { previousCompanies };
    },
    onError: (_error, _id, onMutateResult, context) => {
      context.client.setQueryData(
        ["companies"],
        onMutateResult?.previousCompanies
      );
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  return { deleteCompany, isPending };
}
