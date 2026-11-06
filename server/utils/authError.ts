import type { H3Event } from "h3";

export function sendAuthError(event: H3Event, error: unknown) {
    const e = error as any;
    const data = e?.data ?? {};

    const message = data.message
        ?? data.statusMessage
        ?? e?.statusMessage
        ?? "Authentication failed.";
    const statusCode = e?.statusCode ?? e?.status ?? 500;

    return sendRedirect(event, `/?error=${encodeURIComponent(String(message))}&errorCode=${encodeURIComponent(String(statusCode))}&message=${e?.message}`);
}
