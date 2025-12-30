import {
  SubcategoryService,
  type ICreateSubcategoryDTO,
  type ISubcategoryResponse,
} from "@/services/SubcategoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateSubcategory() {
  const queryClient = useQueryClient();

  const { mutateAsync: createSubcategory, isPending } = useMutation({
    mutationFn: (subcategory: ICreateSubcategoryDTO) =>
      SubcategoryService.createSubcategory(subcategory),
    onMutate: async (newSubcategory, context) => {
      await queryClient.cancelQueries({ queryKey: ["subcategories"] });

      const previousSubcategories =
        context.client.getQueryData<ISubcategoryResponse[]>(["subcategories"]);

      context.client.setQueryData(
        ["subcategories"],
        (old: ISubcategoryResponse[] = []) => [...old, newSubcategory]
      );

      return { previousSubcategories };
    },
    onError: (_error, _newSubcategory, onMutateResult, context) => {
      context.client.setQueryData(
        ["subcategories"],
        onMutateResult?.previousSubcategories
      );
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });

  return { createSubcategory, isPending };
}
