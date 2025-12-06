import { documentNavCards, DocumentNavKey } from "@/lib/documentWorkspace";
import { cn } from "@/lib/utils";

type DocumentQuickActionsProps = {
  onAction?: (key: DocumentNavKey) => void;
  className?: string;
};

const DocumentQuickActions = ({
  onAction,
  className,
}: DocumentQuickActionsProps) => {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {documentNavCards.map((card) => (
        <button
          type="button"
          key={card.key}
          className="rounded-xl border border-border/60 bg-card p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 hover:border-primary hover:shadow-sm"
          onClick={() => onAction?.(card.key)}
        >
          <p className="text-base font-semibold">{card.title}</p>
          <p className="text-xs text-muted-foreground">{card.subtitle}</p>
        </button>
      ))}
    </div>
  );
};

export default DocumentQuickActions;



