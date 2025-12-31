import { httpClient } from "./httpClient";

export interface ICreateSubsubcategoryDTO {
  name: string;
  subcategory_id: string;
}

export interface IUpdateSubsubcategoryDTO {
  name?: string;
  subcategory_id?: string;
}

export interface ISubsubcategoryResponse {
  id: string;
  name: string;
  subcategory_id: string;
  created_at: string;
}

export class SubsubcategoryService {
  static async listSubsubcategories() {
    const { data } = await httpClient.get<ISubsubcategoryResponse[]>(
      "/sub-sub-categories"
    );
    return data;
  }

  static async createSubsubcategory(body: ICreateSubsubcategoryDTO) {
    const { data } = await httpClient.post("/sub-sub-category", body);
    return data;
  }

  static async updateSubsubcategory(
    id: string,
    body: IUpdateSubsubcategoryDTO
  ) {
    const { data } = await httpClient.put(`/sub-sub-category/${id}`, body);
    return data;
  }

  static async deleteSubsubcategory(id: string) {
    await httpClient.delete(`/sub-sub-category/${id}`);
  }
}
