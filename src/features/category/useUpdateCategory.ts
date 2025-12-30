import {
  CategoryService,
  type ICategoryResponse,
  type IUpdateCategoryDTO,
} from "@/services/CategoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateCategory, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateCategoryDTO }) =>
      CategoryService.updateCategory(id, data),
    onMutate: async ({ id, data }, context) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      const previousCategories =
        context.client.getQueryData<ICategoryResponse[]>(["categories"]);

      context.client.setQueryData(
        ["categories"],
        (old: ICategoryResponse[] = []) =>
          old.map((category) =>
            category.id === id ? { ...category, ...data } : category
          )
      );

      return { previousCategories };
    },
    onError: (_error, _variables, onMutateResult, context) => {
      context.client.setQueryData(
        ["categories"],
        onMutateResult?.previousCategories
      );
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { updateCategory, isPending };
}
