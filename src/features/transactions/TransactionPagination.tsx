import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BackwardIcon,
  ForwardIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ITransactionPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function TransactionPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: ITransactionPaginationProps) {
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {startItem} a {endItem} de {total} registros
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Registros por página:
          </span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => onLimitChange(parseInt(value || "10"))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
        >
          <HugeiconsIcon
            icon={BackwardIcon}
            strokeWidth={2}
            className="size-4"
          />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <HugeiconsIcon
            icon={ArrowLeftIcon}
            strokeWidth={2}
            className="size-4"
          />
          Anterior
        </Button>

        <div className="text-sm text-muted-foreground">
          Página {page} de {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Próxima
          <HugeiconsIcon
            icon={ArrowRightIcon}
            strokeWidth={2}
            className="size-4"
          />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
        >
          <HugeiconsIcon
            icon={ForwardIcon}
            strokeWidth={2}
            className="size-4"
          />
        </Button>
      </div>
    </div>
  );
}
