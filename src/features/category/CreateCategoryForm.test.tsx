import { renderWithProviders } from "@/test/utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreateCategoryForm } from "./CreateCategoryForm";

const mockCreateCategory = vi.fn();

vi.mock("./useCreateCategory", () => ({
  useCreateCategory: () => ({
    createCategory: mockCreateCategory,
    isPending: false,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("CreateCategoryForm", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("renderização", () => {
    it("renderiza título 'Nova categoria'", () => {
      renderWithProviders(
        <CreateCategoryForm isOpen={true} onClose={mockOnClose} />
      );

      expect(
        screen.getByRole("heading", { name: /nova categoria/i })
      ).toBeInTheDocument();
    });

    it("renderiza descrição", () => {
      renderWithProviders(
        <CreateCategoryForm isOpen={true} onClose={mockOnClose} />
      );

      expect(
        screen.getByText(
          /adicione uma nova categoria para categorizar suas transações/i
        )
      ).toBeInTheDocument();
    });

    it("renderiza input com placeholder correto", () => {
      renderWithProviders(
        <CreateCategoryForm isOpen={true} onClose={mockOnClose} />
      );

      expect(
        screen.getByPlaceholderText(/digite o nome da categoria/i)
      ).toBeInTheDocument();
    });

    it("renderiza botão Cancelar", () => {
      renderWithProviders(
        <CreateCategoryForm isOpen={true} onClose={mockOnClose} />
      );

      expect(
        screen.getByRole("button", { name: /cancelar/i })
      ).toBeInTheDocument();
    });

    it("renderiza botão Criar categoria", () => {
      renderWithProviders(
        <CreateCategoryForm isOpen={true} onClose={mockOnClose} />
      );

      expect(
        screen.getByRole("button", { name: /criar categoria/i })
      ).toBeInTheDocument();
    });

    it("não renderiza quando isOpen é false", () => {
      const { container } = renderWithProviders(
        <CreateCategoryForm isOpen={false} onClose={mockOnClose} />
      );

      expect(container.querySelector("[role='dialog']")).not.toBeVisible();
    });
  });

  describe("validação", () => {
    it("mostra erro ao submeter com campo vazio", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CreateCategoryForm isOpen={true} onClose={mockOnClose} />
      );

      const submitButton = screen.getByRole("button", {
        name: /criar categoria/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/nome da categoria é obrigatório/i)
        ).toBeInTheDocument();
      });

      expect(mockCreateCategory).not.toHaveBeenCalled();
    });

    it("não mostra erro com nome válido", async () => {
      const user = userEvent.setup();
      mockCreateCategory.mockResolvedValue({});

      renderWithProviders(
        <CreateCategoryForm isOpen={true} onClose={mockOnClose} />
      );

      const input = screen.getByPlaceholderText(/digite o nome da categoria/i);
      await user.type(input, "Alimentação");

      await waitFor(() => {
        expect(
          screen.queryByText(/nome da categoria é obrigatório/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("submissão bem-sucedida", () => {
    it("chama createCategory com dados corretos", async () => {
      const user = userEvent.setup();
      mockCreateCategory.mockResolvedValue({});

      renderWithProviders(
        <CreateCategoryForm isOpen={true} onClose={mockOnClose} />
      );

      const input = screen.getByPlaceholderText(/digite o nome da categoria/i);
      await user.type(input, "Transporte");

      const submitButton = screen.getByRole("button", {
        name: /criar categoria/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateCategory).toHaveBeenCalledWith({
          name: "Transporte",
        });
      });
    });

    it("fecha dialog após sucesso", async () => {
      const user = userEvent.setup();
      mockCreateCategory.mockResolvedValue({});

      renderWithProviders(
        <CreateCategoryForm isOpen={true} onClose={mockOnClose} />
      );

      const input = screen.getByPlaceholderText(/digite o nome da categoria/i);
      await user.type(input, "Saúde");

      const submitButton = screen.getByRole("button", {
        name: /criar categoria/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it("mostra toast de sucesso", async () => {
      const user = userEvent.setup();
      mockCreateCategory.mockResolvedValue({});

      renderWithProviders(
        <CreateCategoryForm isOpen={true} onClose={mockOnClose} />
      );

      const input = screen.getByPlaceholderText(/digite o nome da categoria/i);
      await user.type(input, "Educação");

      const submitButton = screen.getByRole("button", {
        name: /criar categoria/i,
      });
      await user.click(submitButton);

      const { toast } = await import("sonner");
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Categoria criada com sucesso"
        );
      });
    });
  });

  describe("submissão com erro", () => {
    it("mostra toast de erro em caso de falha", async () => {
      const user = userEvent.setup();
      mockCreateCategory.mockRejectedValue(new Error("Network error"));

      renderWithProviders(
        <CreateCategoryForm isOpen={true} onClose={mockOnClose} />
      );

      const input = screen.getByPlaceholderText(/digite o nome da categoria/i);
      await user.type(input, "Lazer");

      const submitButton = screen.getByRole("button", {
        name: /criar categoria/i,
      });
      await user.click(submitButton);

      const { toast } = await import("sonner");
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao criar categoria");
      });
    });

    it("não fecha dialog em caso de erro", async () => {
      const user = userEvent.setup();
      mockCreateCategory.mockRejectedValue(new Error("Network error"));

      renderWithProviders(
        <CreateCategoryForm isOpen={true} onClose={mockOnClose} />
      );

      const input = screen.getByPlaceholderText(/digite o nome da categoria/i);
      await user.type(input, "Erro");

      const submitButton = screen.getByRole("button", {
        name: /criar categoria/i,
      });
      await user.click(submitButton);

      const { toast } = await import("sonner");
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockOnClose).not.toHaveBeenCalled();
      });
    });
  });

  describe("cancelamento", () => {
    it("chama onClose ao clicar em Cancelar", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <CreateCategoryForm isOpen={true} onClose={mockOnClose} />
      );

      const cancelButton = screen.getByRole("button", { name: /cancelar/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
