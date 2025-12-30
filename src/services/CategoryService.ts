import { httpClient } from "./httpClient";

export interface ICreateCategoryDTO {
  name: string;
}

export interface IUpdateCategoryDTO {
  name: string;
}

interface ICreateSubCategoryDTO {
  name: string;
  categoryId: string;
}

interface ICreateSubSubCategoryDTO {
  name: string;
  subCategoryId: string;
}

interface IUpdateSubCategoryDTO {
  name: string;
  subCategoryId: string;
}

interface IUpdateSubSubCategoryDTO {
  name: string;
  subSubCategoryId: string;
}

export interface ICategoryResponse {
  id: string;
  name: string;
  created_at: string;
}

export class CategoryService {
  static async listCategories() {
    const { data } = await httpClient.get<ICategoryResponse[]>("/categories");
    return data;
  }

  static async createCategory(body: ICreateCategoryDTO) {
    const { data } = await httpClient.post("/category", body);
    return data;
  }

  static async createSubCategory(body: ICreateSubCategoryDTO) {
    const { data } = await httpClient.post("/sub-category", body);
    return data;
  }

  static async createSubSubCategory(body: ICreateSubSubCategoryDTO) {
    const { data } = await httpClient.post("/sub-sub-category", body);
    return data;
  }

  static async updateCategory(id: string, body: IUpdateCategoryDTO) {
    const { data } = await httpClient.put(`/category/${id}`, body);
    return data;
  }

  static async updateSubCategory(id: string, body: IUpdateSubCategoryDTO) {
    const { data } = await httpClient.put(`/sub-category/${id}`, body);
    return data;
  }

  static async updateSubSubCategory(
    id: string,
    body: IUpdateSubSubCategoryDTO
  ) {
    const { data } = await httpClient.put(`/sub-sub-category/${id}`, body);
    return data;
  }

  static async deleteCategory(id: string) {
    await httpClient.delete(`/category/${id}`);
  }

  static async deleteSubCategory(id: string) {
    await httpClient.delete(`/sub-category/${id}`);
  }

  static async deleteSubSubCategory(id: string) {
    await httpClient.delete(`/sub-sub-category/${id}`);
  }
}
