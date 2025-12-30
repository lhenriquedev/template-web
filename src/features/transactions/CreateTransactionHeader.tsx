import { Button } from "@/components/ui/button";
import { Upload04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CreateInvoiceDialog } from "./CreateTransactionDialog";

export function CreateInvoiceHeader() {
  const handleImportCSV = () => {
    // TODO: Implement CSV import
    console.log("Import CSV");
  };

  return (
    <>
      <div className="flex gap-2 justify-end items-end">
        <Button size="lg" variant="outline" onClick={handleImportCSV}>
          <HugeiconsIcon icon={Upload04Icon} />
          Importar CSV/Excel
        </Button>

        <CreateInvoiceDialog />
      </div>
    </>
  );
}
