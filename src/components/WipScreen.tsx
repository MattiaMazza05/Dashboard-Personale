import { Icon } from "@iconify/react";
import { EmptyState } from "@heroui/react";

interface WipScreenProps {
  title: string;
}

export default function WipScreen({ title }: WipScreenProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <EmptyState.Root className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-default">
          <Icon icon="solar:hourglass-line-linear" className="h-8 w-8 text-muted" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          <p className="max-w-sm text-sm text-muted">
            Questa sezione è ancora in lavorazione. Torna a trovarci presto!
          </p>
        </div>
      </EmptyState.Root>
    </div>
  );
}
