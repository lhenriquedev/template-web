import { SubcategoryService } from "@/services/SubcategoryService";
import { useQuery } from "@tanstack/react-query";

export function useListSubcategories() {
  const { data, isPending, error } = useQuery({
    queryKey: ["subcategories"],
    queryFn: () => SubcategoryService.listSubcategories(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { subcategories: data, isPending, error };
}
