import {
  CategoryService,
  type ICategoryResponse,
} from "@/services/CategoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteCategory, isPending } = useMutation({
    mutationFn: (id: string) => CategoryService.deleteCategory(id),
    onMutate: async (id, context) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      const previousCategories =
        context.client.getQueryData<ICategoryResponse[]>(["categories"]);

      context.client.setQueryData(
        ["categories"],
        (old: ICategoryResponse[] = []) =>
          old.filter((category) => category.id !== id)
      );

      return { previousCategories };
    },
    onError: (_error, _id, onMutateResult, context) => {
      context.client.setQueryData(
        ["categories"],
        onMutateResult?.previousCategories
      );
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["categories"] });
      context.client.invalidateQueries({ queryKey: ["subcategories"] });
      context.client.invalidateQueries({ queryKey: ["subsubcategories"] });
    },
  });

  return { deleteCategory, isPending };
}
