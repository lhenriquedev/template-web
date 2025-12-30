import { CategoryService } from "@/services/CategoryService";
import { mockCategories, mockCategory } from "@/test/mocks/categoryMocks";
import { createMockQueryClient, createWrapper } from "@/test/utils";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDeleteCategory } from "./useDeleteCategory";

vi.mock("@/services/CategoryService");

describe("useDeleteCategory", () => {
  it("deleta categoria com sucesso", async () => {
    vi.mocked(CategoryService.deleteCategory).mockResolvedValue(undefined);

    const queryClient = createMockQueryClient();
    const { result } = renderHook(() => useDeleteCategory(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.deleteCategory(mockCategory.id);

    expect(CategoryService.deleteCategory).toHaveBeenCalledWith(
      mockCategory.id
    );
  });

  it("remove categoria do cache (optimistic update)", async () => {
    vi.mocked(CategoryService.deleteCategory).mockImplementation(
      () => new Promise(() => {})
    );

    const queryClient = createMockQueryClient();
    queryClient.setQueryData(["categories"], mockCategories);

    const { result } = renderHook(() => useDeleteCategory(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.deleteCategory(mockCategory.id);

    await waitFor(() => {
      const cachedData = queryClient.getQueryData(["categories"]);
      expect(cachedData).not.toContainEqual(
        expect.objectContaining({ id: mockCategory.id })
      );
    });
  });

  it("restaura categoria no cache em caso de erro (rollback)", async () => {
    vi.mocked(CategoryService.deleteCategory).mockRejectedValue(
      new Error("Erro ao deletar")
    );

    const queryClient = createMockQueryClient();
    queryClient.setQueryData(["categories"], mockCategories);

    const { result } = renderHook(() => useDeleteCategory(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(
      result.current.deleteCategory(mockCategory.id)
    ).rejects.toThrow();

    await waitFor(() => {
      const cachedData = queryClient.getQueryData(["categories"]);
      expect(cachedData).toEqual(mockCategories);
      expect(cachedData).toContainEqual(
        expect.objectContaining({ id: mockCategory.id })
      );
    });
  });

  it("invalida queries ['categories'], ['subcategories'] e ['subsubcategories']", async () => {
    vi.mocked(CategoryService.deleteCategory).mockResolvedValue(undefined);

    const queryClient = createMockQueryClient();
    queryClient.setQueryData(["categories"], mockCategories);

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteCategory(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.deleteCategory(mockCategory.id);

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["categories"],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["subcategories"],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["subsubcategories"],
      });
    });
  });

  it("define isPending como true durante mutação", async () => {
    let resolveMutation: () => void;
    vi.mocked(CategoryService.deleteCategory).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMutation = () => resolve(undefined);
        })
    );

    const queryClient = createMockQueryClient();
    const { result } = renderHook(() => useDeleteCategory(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.deleteCategory(mockCategory.id);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    resolveMutation!();

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });
});
