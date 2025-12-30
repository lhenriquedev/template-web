import { CategoryService } from "@/services/CategoryService";
import { mockCategories } from "@/test/mocks/categoryMocks";
import { createMockQueryClient, createWrapper } from "@/test/utils";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useListCategories } from "./useListCategories";

vi.mock("@/services/CategoryService");

describe("useListCategories", () => {
  it("retorna lista de categorias com sucesso", async () => {
    vi.mocked(CategoryService.listCategories).mockResolvedValue(mockCategories);

    const queryClient = createMockQueryClient();
    const { result } = renderHook(() => useListCategories(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.error).toBeNull();
  });

  it("define isPending como true durante carregamento", () => {
    vi.mocked(CategoryService.listCategories).mockImplementation(
      () => new Promise(() => {})
    );

    const queryClient = createMockQueryClient();
    const { result } = renderHook(() => useListCategories(), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.categories).toBeUndefined();
  });

  it("captura erro e retorna em error", async () => {
    const errorMessage = "Erro ao buscar categorias";
    vi.mocked(CategoryService.listCategories).mockRejectedValue(
      new Error(errorMessage)
    );

    const queryClient = createMockQueryClient();
    const { result } = renderHook(() => useListCategories(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.error).toBeTruthy();
    expect(result.current.categories).toBeUndefined();
  });

  it("usa query key ['categories']", () => {
    vi.mocked(CategoryService.listCategories).mockResolvedValue(mockCategories);

    const queryClient = createMockQueryClient();
    renderHook(() => useListCategories(), {
      wrapper: createWrapper(queryClient),
    });

    const queries = queryClient.getQueryCache().getAll();
    const categoryQuery = queries.find(
      (q) => JSON.stringify(q.queryKey) === JSON.stringify(["categories"])
    );

    expect(categoryQuery).toBeDefined();
  });
});
