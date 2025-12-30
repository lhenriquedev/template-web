import { mockCategory } from "@/test/mocks/categoryMocks";
import { renderWithProviders } from "@/test/utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CategoryItemDialog } from "./CategoryItemDialog";

const mockUpdateCategory = vi.fn();

vi.mock("./useUpdateCategory", () => ({
  useUpdateCategory: () => ({
    updateCategory: mockUpdateCategory,
    isPending: false,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("CategoryItemDialog", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("renderização", () => {
    it("renderiza título dinâmico com nome da categoria", () => {
      renderWithProviders(
        <CategoryItemDialog
          isOpen={true}
          onClose={mockOnClose}
          category={mockCategory}
        />
      );

      expect(
        screen.getByRole("heading", {
          name: new RegExp(`editar.*${mockCategory.name}`, "i"),
        })
      ).toBeInTheDocument();
    });

    it("renderiza input preenchido com category.name", () => {
      renderWithProviders(
        <CategoryItemDialog
          isOpen={true}
          onClose={mockOnClose}
          category={mockCategory}
        />
      );

      const input = screen.getByDisplayValue(mockCategory.name);
      expect(input).toBeInTheDocument();
    });

    it("renderiza botão Salvar alterações", () => {
      renderWithProviders(
        <CategoryItemDialog
          isOpen={true}
          onClose={mockOnClose}
          category={mockCategory}
        />
      );

      expect(
        screen.getByRole("button", { name: /salvar alterações/i })
      ).toBeInTheDocument();
    });

    it("não renderiza quando category é null", () => {
      const { container } = renderWithProviders(
        <CategoryItemDialog isOpen={true} onClose={mockOnClose} category={null} />
      );

      expect(container.querySelector("[role='dialog']")).not.toBeVisible();
    });
  });

  describe("validação", () => {
    it("mostra erro ao submeter com campo vazio", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CategoryItemDialog
          isOpen={true}
          onClose={mockOnClose}
          category={mockCategory}
        />
      );

      const input = screen.getByDisplayValue(mockCategory.name);
      await user.clear(input);

      const submitButton = screen.getByRole("button", {
        name: /salvar alterações/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/nome da categoria é obrigatório/i)
        ).toBeInTheDocument();
      });

      expect(mockUpdateCategory).not.toHaveBeenCalled();
    });
  });

  describe("submissão bem-sucedida", () => {
    it("chama updateCategory com ID e dados corretos", async () => {
      const user = userEvent.setup();
      const updatedName = "Alimentação Atualizada";
      mockUpdateCategory.mockResolvedValue({});

      renderWithProviders(
        <CategoryItemDialog
          isOpen={true}
          onClose={mockOnClose}
          category={mockCategory}
        />
      );

      const input = screen.getByDisplayValue(mockCategory.name);
      await user.clear(input);
      await user.type(input, updatedName);

      const submitButton = screen.getByRole("button", {
        name: /salvar alterações/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateCategory).toHaveBeenCalledWith({
          id: mockCategory.id,
          data: { name: updatedName },
        });
      });
    });

    it("fecha dialog após sucesso", async () => {
      const user = userEvent.setup();
      mockUpdateCategory.mockResolvedValue({});

      renderWithProviders(
        <CategoryItemDialog
          isOpen={true}
          onClose={mockOnClose}
          category={mockCategory}
        />
      );

      const input = screen.getByDisplayValue(mockCategory.name);
      await user.clear(input);
      await user.type(input, "Novo Nome");

      const submitButton = screen.getByRole("button", {
        name: /salvar alterações/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("mostra toast de sucesso", async () => {
      const user = userEvent.setup();
      mockUpdateCategory.mockResolvedValue({});

      renderWithProviders(
        <CategoryItemDialog
          isOpen={true}
          onClose={mockOnClose}
          category={mockCategory}
        />
      );

      const input = screen.getByDisplayValue(mockCategory.name);
      await user.clear(input);
      await user.type(input, "Atualizado");

      const submitButton = screen.getByRole("button", {
        name: /salvar alterações/i,
      });
      await user.click(submitButton);

      const { toast } = await import("sonner");
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Categoria atualizada com sucesso"
        );
      });
    });
  });

  describe("submissão com erro", () => {
    it("mostra toast de erro em caso de falha", async () => {
      const user = userEvent.setup();
      mockUpdateCategory.mockRejectedValue(new Error("Network error"));

      renderWithProviders(
        <CategoryItemDialog
          isOpen={true}
          onClose={mockOnClose}
          category={mockCategory}
        />
      );

      const input = screen.getByDisplayValue(mockCategory.name);
      await user.clear(input);
      await user.type(input, "Erro");

      const submitButton = screen.getByRole("button", {
        name: /salvar alterações/i,
      });
      await user.click(submitButton);

      const { toast } = await import("sonner");
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Erro ao atualizar categoria"
        );
      });
    });
  });

  describe("atualização de categoria", () => {
    it("atualiza form quando prop category muda", async () => {
      const { rerender } = renderWithProviders(
        <CategoryItemDialog
          isOpen={true}
          onClose={mockOnClose}
          category={mockCategory}
        />
      );

      expect(screen.getByDisplayValue(mockCategory.name)).toBeInTheDocument();

      const newCategory = {
        id: "cat-999",
        name: "Nova Categoria",
        created_at: "2025-01-30T10:00:00Z",
      };

      rerender(
        <CategoryItemDialog
          isOpen={true}
          onClose={mockOnClose}
          category={newCategory}
        />
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue(newCategory.name)).toBeInTheDocument();
      });
    });
  });
});
