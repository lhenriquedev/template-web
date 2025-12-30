import { mockCategories, mockCategory } from "@/test/mocks/categoryMocks";
import { renderWithProviders } from "@/test/utils";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CategoryList } from "./CategoryList";

const mockDeleteCategory = vi.fn();

vi.mock("./useListCategories", () => ({
  useListCategories: vi.fn(() => ({
    categories: mockCategories,
    isPending: false,
    error: null,
  })),
}));

vi.mock("./useDeleteCategory", () => ({
  useDeleteCategory: () => ({
    deleteCategory: mockDeleteCategory,
    isPending: false,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("./CategoryItem", () => ({
  CategoryItem: ({
    category,
    onOpenCategoryItemDialog,
    onDelete,
  }: {
    category: { id: string; name: string };
    onOpenCategoryItemDialog: () => void;
    onDelete: () => void;
  }) => (
    <div data-testid={`category-item-${category.id}`}>
      <span>{category.name}</span>
      <button onClick={onOpenCategoryItemDialog}>Editar</button>
      <button onClick={onDelete}>Excluir</button>
    </div>
  ),
}));

vi.mock("./CategoryItemDialog", () => ({
  CategoryItemDialog: ({
    isOpen,
    category,
  }: {
    isOpen: boolean;
    category: { id: string; name: string } | null;
  }) => (
    <div data-testid="category-item-dialog">
      {isOpen && category && <span>Editing: {category.name}</span>}
    </div>
  ),
}));

describe("CategoryList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("estados de carregamento", () => {
    it("mostra skeleton durante carregamento", () => {
      const { useListCategories } = require("./useListCategories");
      useListCategories.mockReturnValue({
        categories: undefined,
        isPending: true,
        error: null,
      });

      renderWithProviders(<CategoryList />);

      expect(screen.getAllByTestId("skeleton-item").length).toBeGreaterThan(0);
    });

    it("renderiza mensagem de erro quando falha", () => {
      const { useListCategories } = require("./useListCategories");
      const errorMessage = "Failed to load categories";
      useListCategories.mockReturnValue({
        categories: undefined,
        isPending: false,
        error: new Error(errorMessage),
      });

      renderWithProviders(<CategoryList />);

      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("renderiza estado vazio quando lista vazia", () => {
      const { useListCategories } = require("./useListCategories");
      useListCategories.mockReturnValue({
        categories: [],
        isPending: false,
        error: null,
      });

      renderWithProviders(<CategoryList />);

      expect(
        screen.getByText(/nenhuma categoria encontrada/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /comece criando sua primeira categoria para organizar suas transações financeiras/i
        )
      ).toBeInTheDocument();
    });
  });

  describe("renderização de dados", () => {
    it("renderiza lista de categorias quando carrega com sucesso", () => {
      const { useListCategories } = require("./useListCategories");
      useListCategories.mockReturnValue({
        categories: mockCategories,
        isPending: false,
        error: null,
      });

      renderWithProviders(<CategoryList />);

      mockCategories.forEach((category) => {
        expect(
          screen.getByTestId(`category-item-${category.id}`)
        ).toBeInTheDocument();
        expect(screen.getByText(category.name)).toBeInTheDocument();
      });
    });
  });

  describe("edição de categoria", () => {
    it("abre CategoryItemDialog ao clicar em editar", async () => {
      const { useListCategories } = require("./useListCategories");
      useListCategories.mockReturnValue({
        categories: mockCategories,
        isPending: false,
        error: null,
      });

      const user = userEvent.setup();
      renderWithProviders(<CategoryList />);

      const categoryItem = screen.getByTestId(
        `category-item-${mockCategory.id}`
      );
      const editButton = within(categoryItem).getByRole("button", {
        name: /editar/i,
      });

      await user.click(editButton);

      await waitFor(() => {
        expect(
          screen.getByText(`Editing: ${mockCategory.name}`)
        ).toBeInTheDocument();
      });
    });

    it("passa categoria correta para dialog de edição", async () => {
      const { useListCategories } = require("./useListCategories");
      useListCategories.mockReturnValue({
        categories: mockCategories,
        isPending: false,
        error: null,
      });

      const user = userEvent.setup();
      renderWithProviders(<CategoryList />);

      const categoryItem = screen.getByTestId(
        `category-item-${mockCategory.id}`
      );
      const editButton = within(categoryItem).getByRole("button", {
        name: /editar/i,
      });

      await user.click(editButton);

      await waitFor(() => {
        expect(
          screen.getByText(`Editing: ${mockCategory.name}`)
        ).toBeInTheDocument();
      });
    });
  });

  describe("exclusão de categoria", () => {
    it("abre AlertDialog ao clicar em excluir", async () => {
      const { useListCategories } = require("./useListCategories");
      useListCategories.mockReturnValue({
        categories: mockCategories,
        isPending: false,
        error: null,
      });

      const user = userEvent.setup();
      renderWithProviders(<CategoryList />);

      const categoryItem = screen.getByTestId(
        `category-item-${mockCategory.id}`
      );
      const deleteButton = within(categoryItem).getByRole("button", {
        name: /excluir/i,
      });

      await user.click(deleteButton);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /confirmar exclusão/i })
        ).toBeInTheDocument();
        expect(
          screen.getByText(new RegExp(mockCategory.name, "i"))
        ).toBeInTheDocument();
      });
    });

    it("chama deleteCategory ao confirmar exclusão", async () => {
      const { useListCategories } = require("./useListCategories");
      useListCategories.mockReturnValue({
        categories: mockCategories,
        isPending: false,
        error: null,
      });

      mockDeleteCategory.mockResolvedValue(undefined);

      const user = userEvent.setup();
      renderWithProviders(<CategoryList />);

      const categoryItem = screen.getByTestId(
        `category-item-${mockCategory.id}`
      );
      const deleteButton = within(categoryItem).getByRole("button", {
        name: /excluir/i,
      });

      await user.click(deleteButton);

      const confirmButton = await screen.findByRole("button", {
        name: /deletar/i,
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockDeleteCategory).toHaveBeenCalledWith(mockCategory.id);
      });
    });

    it("mostra toast de sucesso após exclusão", async () => {
      const { useListCategories } = require("./useListCategories");
      useListCategories.mockReturnValue({
        categories: mockCategories,
        isPending: false,
        error: null,
      });

      mockDeleteCategory.mockResolvedValue(undefined);

      const user = userEvent.setup();
      renderWithProviders(<CategoryList />);

      const categoryItem = screen.getByTestId(
        `category-item-${mockCategory.id}`
      );
      const deleteButton = within(categoryItem).getByRole("button", {
        name: /excluir/i,
      });

      await user.click(deleteButton);

      const confirmButton = await screen.findByRole("button", {
        name: /deletar/i,
      });
      await user.click(confirmButton);

      const { toast } = await import("sonner");
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Categoria deletada com sucesso"
        );
      });
    });

    it("mostra toast de erro se exclusão falhar", async () => {
      const { useListCategories } = require("./useListCategories");
      useListCategories.mockReturnValue({
        categories: mockCategories,
        isPending: false,
        error: null,
      });

      mockDeleteCategory.mockRejectedValue(new Error("Delete failed"));

      const user = userEvent.setup();
      renderWithProviders(<CategoryList />);

      const categoryItem = screen.getByTestId(
        `category-item-${mockCategory.id}`
      );
      const deleteButton = within(categoryItem).getByRole("button", {
        name: /excluir/i,
      });

      await user.click(deleteButton);

      const confirmButton = await screen.findByRole("button", {
        name: /deletar/i,
      });
      await user.click(confirmButton);

      const { toast } = await import("sonner");
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Erro ao deletar categoria"
        );
      });
    });

    it("fecha dialog ao cancelar exclusão", async () => {
      const { useListCategories } = require("./useListCategories");
      useListCategories.mockReturnValue({
        categories: mockCategories,
        isPending: false,
        error: null,
      });

      const user = userEvent.setup();
      renderWithProviders(<CategoryList />);

      const categoryItem = screen.getByTestId(
        `category-item-${mockCategory.id}`
      );
      const deleteButton = within(categoryItem).getByRole("button", {
        name: /excluir/i,
      });

      await user.click(deleteButton);

      const cancelButton = await screen.findByRole("button", {
        name: /cancelar/i,
      });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { name: /confirmar exclusão/i })
        ).not.toBeInTheDocument();
      });

      expect(mockDeleteCategory).not.toHaveBeenCalled();
    });
  });
});
