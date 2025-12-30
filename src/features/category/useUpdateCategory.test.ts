import { CategoryService } from "@/services/CategoryService";
import { mockCategories, mockCategory } from "@/test/mocks/categoryMocks";
import { createMockQueryClient, createWrapper } from "@/test/utils";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useUpdateCategory } from "./useUpdateCategory";

vi.mock("@/services/CategoryService");

describe("useUpdateCategory", () => {
  it("atualiza categoria com sucesso", async () => {
    const updatedData = { name: "Alimentação Atualizada" };
    vi.mocked(CategoryService.updateCategory).mockResolvedValue({
      ...mockCategory,
      ...updatedData,
    });

    const queryClient = createMockQueryClient();
    const { result } = renderHook(() => useUpdateCategory(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.updateCategory({
      id: mockCategory.id,
      data: updatedData,
    });

    expect(CategoryService.updateCategory).toHaveBeenCalledWith(
      mockCategory.id,
      updatedData
    );
  });

  it("atualiza categoria no cache por ID (optimistic update)", async () => {
    const updatedData = { name: "Nome Atualizado" };
    vi.mocked(CategoryService.updateCategory).mockImplementation(
      () => new Promise(() => {})
    );

    const queryClient = createMockQueryClient();
    queryClient.setQueryData(["categories"], mockCategories);

    const { result } = renderHook(() => useUpdateCategory(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.updateCategory({
      id: mockCategory.id,
      data: updatedData,
    });

    await waitFor(() => {
      const cachedData = queryClient.getQueryData(["categories"]);
      const updatedCategory = (cachedData as typeof mockCategories).find(
        (c) => c.id === mockCategory.id
      );
      expect(updatedCategory?.name).toBe(updatedData.name);
    });
  });

  it("reverte cache em caso de erro (rollback)", async () => {
    const updatedData = { name: "Erro Update" };
    vi.mocked(CategoryService.updateCategory).mockRejectedValue(
      new Error("Erro ao atualizar")
    );

    const queryClient = createMockQueryClient();
    queryClient.setQueryData(["categories"], mockCategories);

    const { result } = renderHook(() => useUpdateCategory(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(
      result.current.updateCategory({
        id: mockCategory.id,
        data: updatedData,
      })
    ).rejects.toThrow();

    await waitFor(() => {
      const cachedData = queryClient.getQueryData(["categories"]);
      expect(cachedData).toEqual(mockCategories);

      const originalCategory = (cachedData as typeof mockCategories).find(
        (c) => c.id === mockCategory.id
      );
      expect(originalCategory?.name).toBe(mockCategory.name);
    });
  });

  it("invalida query ['categories'] após sucesso", async () => {
    const updatedData = { name: "Updated" };
    vi.mocked(CategoryService.updateCategory).mockResolvedValue({
      ...mockCategory,
      ...updatedData,
    });

    const queryClient = createMockQueryClient();
    queryClient.setQueryData(["categories"], mockCategories);

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateCategory(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.updateCategory({
      id: mockCategory.id,
      data: updatedData,
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["categories"],
      });
    });
  });

  it("define isPending como true durante mutação", async () => {
    const updatedData = { name: "Pending Test" };
    let resolveMutation: () => void;
    vi.mocked(CategoryService.updateCategory).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMutation = () =>
            resolve({ ...mockCategory, ...updatedData });
        })
    );

    const queryClient = createMockQueryClient();
    const { result } = renderHook(() => useUpdateCategory(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.updateCategory({
      id: mockCategory.id,
      data: updatedData,
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    resolveMutation!();

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });
});
