import type { ICategoryResponse } from "@/services/CategoryService";

export const mockCategory: ICategoryResponse = {
  id: "cat-123",
  name: "Alimentação",
  created_at: "2025-01-15T10:00:00Z",
};

export const mockCategory2: ICategoryResponse = {
  id: "cat-456",
  name: "Transporte",
  created_at: "2025-01-20T14:30:00Z",
};

export const mockCategory3: ICategoryResponse = {
  id: "cat-789",
  name: "Saúde",
  created_at: "2025-01-25T09:15:00Z",
};

export const mockCategories: ICategoryResponse[] = [
  mockCategory,
  mockCategory2,
  mockCategory3,
];
