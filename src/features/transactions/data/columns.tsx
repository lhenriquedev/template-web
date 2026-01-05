import { Button } from "@/components/ui/button";
import { type ITransactionResponse } from "@/services/TransactionService";
import { DeleteIcon, PencilIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type ColumnDef } from "@tanstack/react-table";

interface ColumnsProps {
  onEdit: (transaction: ITransactionResponse) => void;
  onDelete: (id: string) => void;
}

export function getTransactionColumns({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<ITransactionResponse>[] {
  return [
    {
      accessorKey: "competence_date",
      header: "Competência",
      cell: ({ row }) =>
        new Date(row.original.competence_date).toLocaleDateString("pt-BR"),
      size: 120,
    },
    {
      accessorKey: "cash_date",
      header: "Caixa",
      cell: ({ row }) =>
        new Date(row.original.cash_date).toLocaleDateString("pt-BR"),
      size: 120,
    },
    {
      accessorKey: "amount",
      header: "Valor",
      cell: ({ row }) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(row.original.amount),
      size: 130,
    },
    {
      accessorKey: "company",
      header: "Empresa",
      cell: ({ row }) => row.original.company?.name || "-",
      size: 150,
    },
    {
      accessorKey: "bank_account",
      header: "Conta Bancária",
      cell: ({ row }) => row.original.bank_account?.name || "-",
      size: 150,
    },
    {
      accessorKey: "category",
      header: "Categoria",
      cell: ({ row }) => {
        const parts = [
          row.original.category?.name,
          row.original.subcategory?.name,
          row.original.sub_subcategory?.name,
        ].filter(Boolean);
        return parts.join(" > ") || "-";
      },
      size: 200,
    },
    {
      accessorKey: "supplier",
      header: "Fornecedor",
      cell: ({ row }) => row.original.supplier || "-",
      size: 150,
    },
    {
      accessorKey: "invoice_number",
      header: "Nota Fiscal",
      cell: ({ row }) => row.original.invoice_number || "-",
      size: 120,
    },
    {
      accessorKey: "observation",
      header: "Observação",
      cell: ({ row }) => row.original.observation || "-",
      size: 200,
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(row.original)}
          >
            <HugeiconsIcon
              icon={PencilIcon}
              strokeWidth={2}
              className="size-4"
            />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(row.original.id)}
          >
            <HugeiconsIcon
              icon={DeleteIcon}
              strokeWidth={2}
              className="size-4"
            />
          </Button>
        </div>
      ),
      size: 100,
    },
  ];
}
