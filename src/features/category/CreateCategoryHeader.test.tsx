import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreateCategoryHeader } from "./CreateCategoryHeader";

vi.mock("./CreateCategoryForm", () => ({
  CreateCategoryForm: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => (
    <div data-testid="create-category-form">
      {isOpen && (
        <button onClick={onClose} data-testid="mock-close">
          Close Form
        </button>
      )}
    </div>
  ),
}));

describe("CreateCategoryHeader", () => {
  describe("renderização", () => {
    it("renderiza título 'Gestão de Categorias'", () => {
      render(<CreateCategoryHeader />);

      expect(
        screen.getByRole("heading", { name: /gestão de categorias/i })
      ).toBeInTheDocument();
    });

    it("renderiza descrição", () => {
      render(<CreateCategoryHeader />);

      expect(
        screen.getByText(/organize suas categorias por níveis/i)
      ).toBeInTheDocument();
    });

    it("renderiza botão 'Nova categoria'", () => {
      render(<CreateCategoryHeader />);

      expect(
        screen.getByRole("button", { name: /nova categoria/i })
      ).toBeInTheDocument();
    });
  });

  describe("interação com dialog", () => {
    it("abre dialog ao clicar no botão", async () => {
      const user = userEvent.setup();

      render(<CreateCategoryHeader />);

      const createButton = screen.getByRole("button", {
        name: /nova categoria/i,
      });
      await user.click(createButton);

      expect(screen.getByTestId("mock-close")).toBeInTheDocument();
    });

    it("fecha dialog ao chamar onClose", async () => {
      const user = userEvent.setup();

      render(<CreateCategoryHeader />);

      const createButton = screen.getByRole("button", {
        name: /nova categoria/i,
      });
      await user.click(createButton);

      const closeButton = screen.getByTestId("mock-close");
      await user.click(closeButton);

      expect(screen.queryByTestId("mock-close")).not.toBeInTheDocument();
    });

    it("passa props corretas para CreateCategoryForm", async () => {
      const user = userEvent.setup();

      render(<CreateCategoryHeader />);

      expect(screen.getByTestId("create-category-form")).toBeInTheDocument();

      const createButton = screen.getByRole("button", {
        name: /nova categoria/i,
      });
      await user.click(createButton);

      expect(screen.getByTestId("mock-close")).toBeInTheDocument();
    });
  });
});
