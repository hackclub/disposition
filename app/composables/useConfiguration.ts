// pretty basic wrapper around localStorage but its a nice abstraction in case i ever need to change it :)
export const useConfiguration = (id: string) => {

    
    function write(key: string, value: any) {
        if (!import.meta.client) return;
        localStorage.setItem(`${id}-${key}`, JSON.stringify(value));
    }

    function read(key: string): any {
        if (!import.meta.client) return null;
        const raw = localStorage.getItem(`${id}-${key}`);
        if (raw === null) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return raw; // fallback
        }
    }

    function remove(key: string) {
        if (!import.meta.client) return;
        localStorage.removeItem(`${id}-${key}`);
    }

    function has(key: string): boolean {
        if (!import.meta.client) return false;
        return !!localStorage.getItem(`${id}-${key}`);
    }

    return {
        write,
        read,
        remove,
        has
    }
}