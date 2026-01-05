import { httpClient } from "./httpClient";

export interface ICreateTransactionDTO {
  competence_date: string;
  cash_date: string;
  amount: number;
  bank_account_id: string;
  company_id: string;
  category_id: string;
  subcategory_id?: string;
  sub_subcategory_id?: string;
  observation?: string;
  invoice_number?: string;
  supplier?: string;
}

export interface IUpdateTransactionDTO {
  competence_date?: string;
  cash_date?: string;
  amount?: number;
  bank_account_id?: string;
  company_id?: string;
  category_id?: string;
  subcategory_id?: string | null;
  sub_subcategory_id?: string | null;
  observation?: string | null;
  invoice_number?: string | null;
  supplier?: string | null;
}

export interface ITransactionResponse {
  id: string;
  competence_date: string;
  cash_date: string;
  amount: number;
  bank_account_id: string;
  company_id: string;
  category_id: string;
  subcategory_id?: string;
  sub_subcategory_id?: string;
  observation?: string;
  invoice_number?: string;
  supplier?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  company?: { id: string; name: string; document: string };
  bank_account?: { id: string; name: string; bank_name: string };
  category?: { id: string; name: string };
  subcategory?: { id: string; name: string };
  sub_subcategory?: { id: string; name: string };
}

export interface IListTransactionsFilters {
  page?: number;
  limit?: number;
  company_id?: string;
  bank_account_id?: string;
  category_id?: string;
  subcategory_id?: string;
  sub_subcategory_id?: string;
  competence_date_start?: string;
  competence_date_end?: string;
  cash_date_start?: string;
  cash_date_end?: string;
  sort_by?: "competence_date" | "cash_date" | "amount" | "created_at";
  sort_order?: "asc" | "desc";
}

export interface IListTransactionsResponse {
  data: ITransactionResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export class TransactionService {
  static async listTransactions(filters: IListTransactionsFilters = {}) {
    const { data } = await httpClient.get<IListTransactionsResponse>(
      "/transactions",
      {
        params: filters,
      }
    );
    return data;
  }

  static async getTransaction(id: string) {
    const { data } = await httpClient.get<ITransactionResponse>(
      `/transaction/${id}`
    );
    return data;
  }

  static async createTransaction(body: ICreateTransactionDTO) {
    const { data } = await httpClient.post<ITransactionResponse>(
      "/transaction",
      body
    );
    return data;
  }

  static async updateTransaction(id: string, body: IUpdateTransactionDTO) {
    const { data } = await httpClient.put<ITransactionResponse>(
      `/transaction/${id}`,
      body
    );
    return data;
  }

  static async deleteTransaction(id: string) {
    await httpClient.delete(`/transaction/${id}`);
  }
}
