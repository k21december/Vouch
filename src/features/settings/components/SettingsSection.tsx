interface SettingsSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function SettingsSection({
    title,
    children,
}: SettingsSectionProps) {
    return (
        <div className="mb-10">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                {title}
            </h3>
            <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-main)]">
                {children}
            </div>
        </div>
    );
}
