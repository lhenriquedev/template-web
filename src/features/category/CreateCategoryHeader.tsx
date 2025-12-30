// import { CreateCategoryForm } from "./CreateCategoryForm";

import { Button } from "@/components/ui/button";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { CreateCategoryForm } from "./CreateCategoryForm";

export function CreateCategoryHeader() {
  const [isCreateCategoryFormOpen, setIsCreateCategoryFormOpen] =
    useState(false);

  const handleOpenCreateCategoryForm = () => {
    setIsCreateCategoryFormOpen(true);
  };

  const handleCloseCreateCategoryForm = () => {
    setIsCreateCategoryFormOpen(false);
  };

  return (
    <div className="flex gap-4 justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Gestão de Categorias
        </h1>
        <p className="text-muted-foreground text-sm">
          Organize suas categorias por níveis.
        </p>
      </div>

      <Button
        size="lg"
        variant="default"
        onClick={handleOpenCreateCategoryForm}
      >
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        Nova categoria
      </Button>

      <CreateCategoryForm
        isOpen={isCreateCategoryFormOpen}
        onClose={handleCloseCreateCategoryForm}
      />
    </div>
  );
}
