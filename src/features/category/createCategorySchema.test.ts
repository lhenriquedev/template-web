import { describe, expect, it } from "vitest";
import { createCategorySchema } from "./createCategorySchema";

describe("createCategorySchema", () => {
  describe("válido", () => {
    it("aceita nome válido", () => {
      const validData = { name: "Alimentação" };
      const result = createCategorySchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("remove campos extras", () => {
      const dataWithExtraFields = {
        name: "Transporte",
        extraField: "should be removed",
      };
      const result = createCategorySchema.safeParse(dataWithExtraFields);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ name: "Transporte" });
        expect(result.data).not.toHaveProperty("extraField");
      }
    });
  });

  describe("inválido", () => {
    it("rejeita nome vazio", () => {
      const invalidData = { name: "" };
      const result = createCategorySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Nome da categoria é obrigatório"
        );
      }
    });

    it("rejeita campo name ausente", () => {
      const invalidData = {};
      const result = createCategorySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Nome da categoria é obrigatório"
        );
      }
    });

    it("rejeita name com apenas espaços em branco", () => {
      const invalidData = { name: "   " };
      const result = createCategorySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Nome da categoria é obrigatório"
        );
      }
    });
  });
});
