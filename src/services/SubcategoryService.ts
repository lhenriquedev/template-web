import { httpClient } from "./httpClient";

export interface ICreateSubcategoryDTO {
  name: string;
  category_id: string;
}

export interface IUpdateSubcategoryDTO {
  name?: string;
  category_id?: string;
}

export interface ISubcategoryResponse {
  id: string;
  name: string;
  category_id: string;
  created_at: string;
}

export class SubcategoryService {
  static async listSubcategories() {
    const { data } = await httpClient.get<ISubcategoryResponse[]>(
      "/sub-categories"
    );
    return data;
  }

  static async createSubcategory(body: ICreateSubcategoryDTO) {
    const { data } = await httpClient.post("/sub-category", body);
    return data;
  }

  static async updateSubcategory(id: string, body: IUpdateSubcategoryDTO) {
    const { data } = await httpClient.put(`/sub-category/${id}`, body);
    return data;
  }

  static async deleteSubcategory(id: string) {
    await httpClient.delete(`/sub-category/${id}`);
  }
}
