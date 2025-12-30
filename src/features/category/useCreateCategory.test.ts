import { CategoryService } from "@/services/CategoryService";
import { mockCategories, mockCategory } from "@/test/mocks/categoryMocks";
import { createMockQueryClient, createWrapper } from "@/test/utils";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCreateCategory } from "./useCreateCategory";

vi.mock("@/services/CategoryService");

describe("useCreateCategory", () => {
  it("cria categoria com sucesso", async () => {
    const newCategory = { name: "Nova Categoria" };
    vi.mocked(CategoryService.createCategory).mockResolvedValue(mockCategory);

    const queryClient = createMockQueryClient();
    const { result } = renderHook(() => useCreateCategory(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.createCategory(newCategory);

    expect(CategoryService.createCategory).toHaveBeenCalledWith(newCategory);
  });

  it("adiciona categoria ao cache antes da resposta (optimistic update)", async () => {
    const newCategory = { name: "Lazer" };
    vi.mocked(CategoryService.createCategory).mockImplementation(
      () => new Promise(() => {})
    );

    const queryClient = createMockQueryClient();
    queryClient.setQueryData(["categories"], mockCategories);

    const { result } = renderHook(() => useCreateCategory(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.createCategory(newCategory);

    await waitFor(() => {
      const cachedData = queryClient.getQueryData(["categories"]);
      expect(cachedData).toContainEqual(newCategory);
    });
  });

  it("reverte cache em caso de erro (rollback)", async () => {
    const newCategory = { name: "Erro" };
    vi.mocked(CategoryService.createCategory).mockRejectedValue(
      new Error("Erro ao criar")
    );

    const queryClient = createMockQueryClient();
    queryClient.setQueryData(["categories"], mockCategories);

    const { result } = renderHook(() => useCreateCategory(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(result.current.createCategory(newCategory)).rejects.toThrow();

    await waitFor(() => {
      const cachedData = queryClient.getQueryData(["categories"]);
      expect(cachedData).toEqual(mockCategories);
      expect(cachedData).not.toContainEqual(newCategory);
    });
  });

  it("invalida query ['categories'] após sucesso", async () => {
    const newCategory = { name: "Investimentos" };
    vi.mocked(CategoryService.createCategory).mockResolvedValue(mockCategory);

    const queryClient = createMockQueryClient();
    queryClient.setQueryData(["categories"], mockCategories);

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateCategory(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.createCategory(newCategory);

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["categories"],
      });
    });
  });

  it("define isPending como true durante mutação", async () => {
    const newCategory = { name: "Pending Test" };
    let resolveMutation: () => void;
    vi.mocked(CategoryService.createCategory).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveMutation = () => resolve(mockCategory);
        })
    );

    const queryClient = createMockQueryClient();
    const { result } = renderHook(() => useCreateCategory(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.createCategory(newCategory);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    resolveMutation!();

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });
});
