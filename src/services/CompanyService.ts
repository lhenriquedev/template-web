import { httpClient } from "./httpClient";

export interface ICreateCompanyDTO {
  name: string;
  document: string;
}

export interface IUpdateCompanyDTO {
  name: string;
  document: string;
}

export interface ICompanyResponse {
  id: string;
  name: string;
  document: string;
  created_at: string;
}

export class CompanyService {
  static async listCompanies() {
    const { data } = await httpClient.get<ICompanyResponse[]>("/companies");
    return data;
  }

  static async createCompany(body: ICreateCompanyDTO) {
    const { data } = await httpClient.post("/company", body);
    return data;
  }

  static async updateCompany(id: string, body: IUpdateCompanyDTO) {
    const { data } = await httpClient.put(`/company/${id}`, body);
    return data;
  }

  static async deleteCompany(id: string) {
    await httpClient.delete(`/company/${id}`);
  }
}
