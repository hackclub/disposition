import type { H3Event } from "h3";

export function sendAuthError(event: H3Event, error: unknown) {
    const e = error as any;
    const data = e?.data ?? {};

    let message: string = data.message
        ?? data.statusMessage
        ?? e?.statusMessage
        ?? "Authentication failed.";
    const statusCode = e?.statusCode ?? e?.status ?? 500;

    if(statusCode >= 500 && import.meta.dev)
        throw error; // big smells let's not handle that

    if(statusCode >= 500)
        message = "The server encountered an error."; // let's not potentially leak sensitive information

    return sendRedirect(event, `/?error=${encodeURIComponent(String(message))}&errorCode=${encodeURIComponent(String(statusCode))}&message=${encodeURIComponent(e?.message)}`);
}
