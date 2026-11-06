export type AppErrorOptions = {
    title?: string,
    message?: string,
    statusCode?: number,
    details?: string
}

export const useErrorHandler = () => {
    const manager = useWindowManager();

    function showError(error?: unknown, options: AppErrorOptions = {}) {
        const e = error as any;
        const data = e?.data ?? {};

        const errorTitle = e?.error ?? data.error;
        const statusCode = options.statusCode ?? e?.statusCode ?? data.statusCode;
        const message = options.message
            ?? data.message
            ?? e?.message
            ?? "An unexpected error occurred.";
        const details = options.details ?? (import.meta.dev ? e?.stack : undefined);

        manager.open("error", {
            title: options.title ?? (errorTitle ?? "Something went wrong"),
            message: String(message),
            statusCode: statusCode ? `Error code ${statusCode}` : undefined,
            details: details ? String(details) : undefined,
        });
    }

    return { showError };
}
