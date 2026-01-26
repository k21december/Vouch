import { cn } from "@/lib/utils/cn";

export default function Surface({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/40 bg-card/70 shadow-sm backdrop-blur supports-backdrop-filter:bg-card/50",
        className
      )}
    >
      {children}
    </div>
  );
}
