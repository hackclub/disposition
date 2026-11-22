import type { AppDef } from "~/types/window"

// every app declares its own `*.manifest.ts` next to its component
const manifests = import.meta.glob<{ default: AppDef }>(
    ["~/apps/**/*.manifest.ts", "~/components/*.manifest.ts"],
    { eager: true },
)

export const APPS: Record<string, AppDef> = Object.fromEntries(
    Object.values(manifests).map(({ default: app }) => [app.appId, app] as const),
)
