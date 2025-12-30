import { CategoryService } from "@/services/CategoryService";
import { useQuery } from "@tanstack/react-query";

export function useListCategories() {
  const { data, isPending, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.listCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { categories: data, isPending, error };
}
