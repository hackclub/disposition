function compareVersions(a: string, b: string): number {
    const pa = a.split('.').map(Number)
    const pb = b.split('.').map(Number)
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const diff = (pa[i] ?? 0) - (pb[i] ?? 0)
        if (diff !== 0) return diff > 0 ? 1 : -1
    }
    return 0
}

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const defaults = config.public.defaultConfig;

    const settings = useConfiguration('settings');

    if (!settings.has('configVersion')) {
        (Object.keys(defaults) as Array<keyof typeof defaults>).forEach(cat => {
            const category = useConfiguration(cat);
            for (const [key, value] of Object.entries(defaults[cat])) {
                category.write(key, value);
            }
        })
    }

    const storedVersion = settings.read('configVersion');
    if (compareVersions(defaults.settings.configVersion, storedVersion) > 0) {
        (Object.keys(defaults) as Array<keyof typeof defaults>).forEach(cat => {
            const category = useConfiguration(cat);
            for (const [key, value] of Object.entries(defaults[cat])) {
                if (!category.has(key)) category.write(key, value);
            }
        })

        settings.write('configVersion', defaults.settings.configVersion);
    }
});
