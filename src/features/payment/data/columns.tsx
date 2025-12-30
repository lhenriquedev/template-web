import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { ColumnDef } from "@tanstack/react-table";

export type Payment = {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  date: Date;
  type: "income" | "expense";
  createdAt: Date;
  updatedAt: Date;
};

export const columns: ColumnDef<Payment>[] = [
  {
    header: "Data",
    accessorKey: "date",
    cell: ({ row }) => {
      return <div>{formatDate(row.original.date)}</div>;
    },
  },
  {
    header: "Descrição",
    accessorKey: "description",
  },
  {
    header: "Categoria",
    accessorKey: "categoryName",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: row.original.categoryColor }}
          />
          <span>{row.original.categoryName}</span>
        </div>
      );
    },
  },
  {
    header: "Tipo",
    accessorKey: "type",
    cell: ({ row }) => {
      return (
        <Badge variant="outline">
          {row.original.type === "income" ? "Receita" : "Despesa"}
        </Badge>
      );
    },
  },
  {
    header: "Valor",
    accessorKey: "amount",
    cell: ({ row }) => {
      return (
        <div
          className={
            row.original.type === "income" ? "text-green-600" : "text-red-600"
          }
        >
          {formatCurrency(row.original.amount)}
        </div>
      );
    },
  },
  {
    header: "Criado em",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      return <div>{formatDate(row.original.createdAt)}</div>;
    },
  },
];
