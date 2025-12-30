import {
  SubsubcategoryService,
  type ICreateSubsubcategoryDTO,
  type ISubsubcategoryResponse,
} from "@/services/SubsubcategoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateSubsubcategory() {
  const queryClient = useQueryClient();

  const { mutateAsync: createSubsubcategory, isPending } = useMutation({
    mutationFn: (subsubcategory: ICreateSubsubcategoryDTO) =>
      SubsubcategoryService.createSubsubcategory(subsubcategory),
    onMutate: async (newSubsubcategory, context) => {
      await queryClient.cancelQueries({ queryKey: ["subsubcategories"] });

      const previousSubsubcategories =
        context.client.getQueryData<ISubsubcategoryResponse[]>([
          "subsubcategories",
        ]);

      context.client.setQueryData(
        ["subsubcategories"],
        (old: ISubsubcategoryResponse[] = []) => [...old, newSubsubcategory]
      );

      return { previousSubsubcategories };
    },
    onError: (_error, _newSubsubcategory, onMutateResult, context) => {
      context.client.setQueryData(
        ["subsubcategories"],
        onMutateResult?.previousSubsubcategories
      );
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["subsubcategories"] });
    },
  });

  return { createSubsubcategory, isPending };
}
