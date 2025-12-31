import { Button } from "@/components/ui/button";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { CreateCompanyForm } from "./CreateCompanyForm";

export function CreateCompanyHeader() {
  const [isCreateCompanyFormOpen, setIsCreateCompanyFormOpen] = useState(false);

  const handleOpenCreateCompanyForm = () => {
    setIsCreateCompanyFormOpen(true);
  };

  const handleCloseCreateCompanyForm = () => {
    setIsCreateCompanyFormOpen(false);
  };

  return (
    <div className="flex gap-4 justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Gestão de Empresas
        </h1>
        <p className="text-muted-foreground text-sm">
          Gerencie as empresas cadastradas no sistema.
        </p>
      </div>

      <Button
        size="lg"
        variant="default"
        onClick={handleOpenCreateCompanyForm}
      >
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        Nova empresa
      </Button>

      <CreateCompanyForm
        isOpen={isCreateCompanyFormOpen}
        onClose={handleCloseCreateCompanyForm}
      />
    </div>
  );
}
