import { httpClient } from "./httpClient";

export interface ICreateBankAccountDTO {
  name: string;
  bank_name: string;
  account_number?: string;
  company_id: string;
}

export interface IUpdateBankAccountDTO {
  name: string;
  bank_name: string;
  account_number?: string;
}

export interface IBankAccountResponse {
  id: string;
  name: string;
  bank_name: string;
  account_number: string | null;
  initial_balance: number;
  current_balance: number;
  company_id: string;
  created_at: string;
}

export class BankAccountService {
  static async listBankAccounts() {
    const { data } = await httpClient.get<{ data: IBankAccountResponse[] }>(
      "/bank-accounts"
    );
    return data.data;
  }

  static async createBankAccount(body: ICreateBankAccountDTO) {
    const { data } = await httpClient.post<IBankAccountResponse>(
      "/bank-account",
      body
    );
    return data;
  }

  static async updateBankAccount(id: string, body: IUpdateBankAccountDTO) {
    const { data } = await httpClient.put<IBankAccountResponse>(
      `/bank-account/${id}`,
      body
    );
    return data;
  }

  static async deleteBankAccount(id: string) {
    await httpClient.delete(`/bank-account/${id}`);
  }
}
