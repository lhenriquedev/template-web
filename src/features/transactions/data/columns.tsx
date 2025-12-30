import type { ColumnDef } from "@tanstack/react-table";

export type InvoiceEntry = {
  id: string;
  competenceDate: Date;
  cashDate: Date;
  planned?: number;
  actual?: number;
  account: string;
  businessUnit: string;
  category: string;
  level1: string;
  level2?: string;
  observation?: string;
  invoice?: string;
  supplier: string;
};

const formatCurrency = (value?: number) => {
  if (!value) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("pt-BR");
};

export const columns: ColumnDef<InvoiceEntry>[] = [
  {
    header: "Data Comp.",
    accessorKey: "competenceDate",
    size: 100,
    cell: ({ row }) => formatDate(row.original.competenceDate),
  },
  {
    header: "Data Caixa",
    accessorKey: "cashDate",
    size: 100,
    cell: ({ row }) => formatDate(row.original.cashDate),
  },
  {
    header: "Previsto",
    accessorKey: "planned",
    size: 120,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.original.planned)}</div>
    ),
  },
  {
    header: "Realizado",
    accessorKey: "actual",
    size: 120,
    cell: ({ row }) => {
      const value = row.original.actual;
      const isNegative = value && value < 0;
      return (
        <div
          className={`text-right ${isNegative ? "text-red-600 font-medium" : ""}`}
        >
          {formatCurrency(value)}
        </div>
      );
    },
  },
  {
    header: "Conta",
    accessorKey: "account",
    size: 120,
  },
  {
    header: "Und. de Negócio",
    accessorKey: "businessUnit",
    size: 120,
  },
  {
    header: "Categoria",
    accessorKey: "category",
    size: 150,
  },
  {
    header: "Nível 1",
    accessorKey: "level1",
    size: 150,
  },
  {
    header: "Nível 2",
    accessorKey: "level2",
    size: 150,
    cell: ({ row }) => row.original.level2 || "-",
  },
  {
    header: "Observação",
    accessorKey: "observation",
    size: 300,
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate" title={row.original.observation}>
        {row.original.observation || "-"}
      </div>
    ),
  },
  {
    header: "NF",
    accessorKey: "invoice",
    size: 100,
    cell: ({ row }) => row.original.invoice || "Sem NF",
  },
  {
    header: "Fornecedores/Favorecidos",
    accessorKey: "supplier",
    size: 200,
  },
];
