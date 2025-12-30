import { Button } from "@/components/ui/button";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useListSubcategories } from "../subcategory/useListSubcategories";
import { CreateSubsubcategoryForm } from "./CreateSubsubcategoryForm";

export function CreateSubsubcategoryHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { subcategories } = useListSubcategories();

  return (
    <>
      <div className="flex gap-4 justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestão de Sub-subcategorias
          </h1>
          <p className="text-muted-foreground text-sm">
            Organize suas sub-subcategorias vinculadas a subcategorias.
          </p>
        </div>

        <Button size="lg" variant="default" onClick={() => setIsOpen(true)}>
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          Nova sub-subcategoria
        </Button>
      </div>

      <CreateSubsubcategoryForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        subcategories={subcategories || []}
      />
    </>
  );
}
