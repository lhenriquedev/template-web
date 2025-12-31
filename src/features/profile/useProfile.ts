import { AuthService } from "@/services/AuthService";
import { useQuery } from "@tanstack/react-query";

export function useProfile(enabled: boolean) {
  const { data, refetch, isPending, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: () => AuthService.getProfile(),
    enabled: enabled ?? true,
    staleTime: Infinity,
  });

  return {
    profile: data,
    loadProfile: refetch,
    isProfileLoading: isPending,
    isProfileError: isError,
  };
}
