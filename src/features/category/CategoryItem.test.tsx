import { mockCategory } from "@/test/mocks/categoryMocks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CategoryItem } from "./CategoryItem";

vi.mock("@/lib/utils", () => ({
  formatDate: vi.fn((date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  }),
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

describe("CategoryItem", () => {
  const mockOnOpenCategoryItemDialog = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("renderização", () => {
    it("renderiza nome da categoria", () => {
      render(
        <CategoryItem
          category={mockCategory}
          onOpenCategoryItemDialog={mockOnOpenCategoryItemDialog}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText(mockCategory.name)).toBeInTheDocument();
    });

    it("renderiza data formatada", () => {
      render(
        <CategoryItem
          category={mockCategory}
          onOpenCategoryItemDialog={mockOnOpenCategoryItemDialog}
          onDelete={mockOnDelete}
        />
      );

      const formattedDate = new Date(
        mockCategory.created_at
      ).toLocaleDateString("pt-BR");
      expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });

    it("renderiza botão Editar", () => {
      render(
        <CategoryItem
          category={mockCategory}
          onOpenCategoryItemDialog={mockOnOpenCategoryItemDialog}
          onDelete={mockOnDelete}
        />
      );

      expect(
        screen.getByRole("button", { name: /editar/i })
      ).toBeInTheDocument();
    });

    it("renderiza botão Excluir", () => {
      render(
        <CategoryItem
          category={mockCategory}
          onOpenCategoryItemDialog={mockOnOpenCategoryItemDialog}
          onDelete={mockOnDelete}
        />
      );

      expect(
        screen.getByRole("button", { name: /excluir/i })
      ).toBeInTheDocument();
    });
  });

  describe("interações", () => {
    it("chama onOpenCategoryItemDialog ao clicar em Editar", async () => {
      const user = userEvent.setup();

      render(
        <CategoryItem
          category={mockCategory}
          onOpenCategoryItemDialog={mockOnOpenCategoryItemDialog}
          onDelete={mockOnDelete}
        />
      );

      const editButton = screen.getByRole("button", { name: /editar/i });
      await user.click(editButton);

      expect(mockOnOpenCategoryItemDialog).toHaveBeenCalledTimes(1);
    });

    it("chama onDelete ao clicar em Excluir", async () => {
      const user = userEvent.setup();

      render(
        <CategoryItem
          category={mockCategory}
          onOpenCategoryItemDialog={mockOnOpenCategoryItemDialog}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByRole("button", { name: /excluir/i });
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });
  });
});
