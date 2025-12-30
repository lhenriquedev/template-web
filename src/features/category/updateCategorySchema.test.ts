import { describe, expect, it } from "vitest";
import { updateCategorySchema } from "./updateCategorySchema";

describe("updateCategorySchema", () => {
  describe("válido", () => {
    it("aceita nome válido", () => {
      const validData = { name: "Saúde" };
      const result = updateCategorySchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("remove campos extras", () => {
      const dataWithExtraFields = {
        name: "Educação",
        extraField: "should be removed",
      };
      const result = updateCategorySchema.safeParse(dataWithExtraFields);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ name: "Educação" });
        expect(result.data).not.toHaveProperty("extraField");
      }
    });
  });

  describe("inválido", () => {
    it("rejeita nome vazio", () => {
      const invalidData = { name: "" };
      const result = updateCategorySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Nome da categoria é obrigatório"
        );
      }
    });

    it("rejeita campo name ausente", () => {
      const invalidData = {};
      const result = updateCategorySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Nome da categoria é obrigatório"
        );
      }
    });

    it("rejeita name com apenas espaços em branco", () => {
      const invalidData = { name: "   " };
      const result = updateCategorySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Nome da categoria é obrigatório"
        );
      }
    });
  });
});
