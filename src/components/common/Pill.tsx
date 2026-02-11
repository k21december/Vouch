export default function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded-full border px-3 py-1 text-xs"
      style={{ borderColor: "rgb(var(--border))", color: "rgb(var(--muted))" }}
    >
      {children}
    </span>
  );
}
