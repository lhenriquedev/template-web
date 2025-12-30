import {
  SubcategoryService,
  type ISubcategoryResponse,
} from "@/services/SubcategoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteSubcategory() {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteSubcategory, isPending } = useMutation({
    mutationFn: (id: string) => SubcategoryService.deleteSubcategory(id),
    onMutate: async (id, context) => {
      await queryClient.cancelQueries({ queryKey: ["subcategories"] });

      const previousSubcategories =
        context.client.getQueryData<ISubcategoryResponse[]>(["subcategories"]);

      context.client.setQueryData(
        ["subcategories"],
        (old: ISubcategoryResponse[] = []) =>
          old.filter((subcategory) => subcategory.id !== id)
      );

      return { previousSubcategories };
    },
    onError: (_error, _id, onMutateResult, context) => {
      context.client.setQueryData(
        ["subcategories"],
        onMutateResult?.previousSubcategories
      );
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["subcategories"] });
      context.client.invalidateQueries({ queryKey: ["subsubcategories"] });
    },
  });

  return { deleteSubcategory, isPending };
}
