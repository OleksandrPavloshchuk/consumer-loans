type DurationFormatOptions = {
    locale?: string;
    maxUnits?: number; // скільки одиниць показувати (1–3)
};

export function formatDuration(
    durationMs: number,
    { locale = navigator.language, maxUnits = 2 }: DurationFormatOptions = {}
): string {
    if (!Number.isFinite(durationMs) || durationMs < 0) {
        return "—";
    }

    const totalSeconds = Math.floor(durationMs / 1000);

    const units = [
        { label: "hour",   seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 }
    ] as const;

    const nf = new Intl.NumberFormat(locale);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "always" });

    let remaining = totalSeconds;
    const parts: string[] = [];

    for (const unit of units) {
        const value = Math.floor(remaining / unit.seconds);
        if (value > 0) {
            // get time unit here ("hour", "min", "seconds")
            const formatted = rtf.formatToParts(value, unit.label)
                .find(p => p.type === "unit")?.value ?? unit.label;

            parts.push(`${nf.format(value)} ${formatted}`);
            remaining -= value * unit.seconds;
        }

        if (parts.length >= maxUnits) break;
    }

    return parts.length > 0 ? parts.join(" ") : `0 ${rtf.formatToParts(0, "second").find(p => p.type === "unit")?.value ?? "s"}`;
}
