import { Button } from "@/components/ui/button";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { CreateBankAccountForm } from "./CreateBankAccountForm";

export function CreateBankAccountHeader() {
  const [isCreateBankAccountFormOpen, setIsCreateBankAccountFormOpen] =
    useState(false);

  const handleOpenCreateBankAccountForm = () => {
    setIsCreateBankAccountFormOpen(true);
  };

  const handleCloseCreateBankAccountForm = () => {
    setIsCreateBankAccountFormOpen(false);
  };

  return (
    <div className="flex gap-4 justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Gestão de Contas Bancárias
        </h1>
        <p className="text-muted-foreground text-sm">
          Gerencie as contas bancárias vinculadas às empresas.
        </p>
      </div>

      <Button
        size="lg"
        variant="default"
        onClick={handleOpenCreateBankAccountForm}
      >
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        Nova conta bancária
      </Button>

      <CreateBankAccountForm
        isOpen={isCreateBankAccountFormOpen}
        onClose={handleCloseCreateBankAccountForm}
      />
    </div>
  );
}
