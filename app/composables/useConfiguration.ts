const cache = reactive<Record<string, any>>({});

export const useConfiguration = (id: string) => {

    function fullKey(key: string) {
        return `${id}-${key}`;
    }

    function write(key: string, value: any) {
        if (!import.meta.client) return;
        const k = fullKey(key);
        localStorage.setItem(k, JSON.stringify(value));
        cache[k] = value; // important for reactivity
    }

    function read(key: string): any {
        if (!import.meta.client) return null;
        const k = fullKey(key);

        // lazily hydrate the cache from localStorage on first read
        if (!(k in cache)) {
            const raw = localStorage.getItem(k);
            if (raw === null) {
                cache[k] = null;
            } else {
                try {
                    cache[k] = JSON.parse(raw);
                } catch {
                    cache[k] = raw;
                }
            }
        }

        return cache[k]; // reading a reactive property -> tracked by computed/render
    }

    function remove(key: string) {
        if (!import.meta.client) return;
        const k = fullKey(key);
        localStorage.removeItem(k);
        cache[k] = null;
    }

    function has(key: string): boolean {
        if (!import.meta.client) return false;
        return read(key) !== null;
    }

    return {
        write,
        read,
        remove,
        has
    }
}