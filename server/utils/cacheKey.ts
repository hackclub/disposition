export function safeCacheKey(...parts: string[]): string {
    return parts
        .map(p => encodeURIComponent(p.toLowerCase()).replaceAll(".", "%2E"))
        .join(":");
}
