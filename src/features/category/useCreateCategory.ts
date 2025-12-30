import {
  CategoryService,
  type ICategoryResponse,
  type ICreateCategoryDTO,
} from "@/services/CategoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  const { mutateAsync: createCategory, isPending } = useMutation({
    mutationFn: (category: ICreateCategoryDTO) =>
      CategoryService.createCategory(category),
    onMutate: async (newCategory, context) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      const previousCategory = context.client.getQueryData<ICategoryResponse[]>(
        ["categories"]
      );
      context.client.setQueryData(
        ["categories"],
        (old: ICategoryResponse[]) => [...old, newCategory]
      );

      return { previousCategory };
    },
    onError: (_error, _newCategory, onMutateResult, context) => {
      context.client.setQueryData(
        ["categories"],
        onMutateResult?.previousCategory
      );
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { createCategory, isPending };
}
