export async function isAdmin() {
    const { loggedIn, user } = await useUserSession();
    return (loggedIn.value && useRuntimeConfig().public.adminIds.includes(user.value!.slackId))
}

export function formatDuration(totalSeconds: number | null | undefined): string {
    if (!totalSeconds) return "";

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const ss = String(s).padStart(2, "0");

    return h > 0
        ? `${h}:${String(m).padStart(2, "0")}:${ss}`
        : `${m}:${ss}`;
}

export function formatTimestamp(value: string | number | Date): string {
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);

    const pad = (n: number) => String(n).padStart(2, "0");
    const hours24 = d.getHours();
    const hours12 = hours24 % 12 || 12;
    const ampm = hours24 >= 12 ? "PM" : "AM";

    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(hours12)}:${pad(d.getMinutes())} ${ampm}`;
}

export function timeAgo(value: string | number | Date): string {
    const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
    if (isNaN(seconds)) return "";
    if (seconds < 60) return "just now";

    const units: [string, number][] = [["y", 31536000], ["mo", 2592000], ["d", 86400], ["h", 3600], ["m", 60]];
    for (const [unit, size] of units) {
        if (seconds >= size) return `${Math.floor(seconds / size)}${unit} ago`;
    }
    return "just now";
}

// truncating markdown and shi. god bless claude sonnet 5.5 //
import type { Node, ElementNode } from 'comark';
import { parseMarkdown } from 'comark';
import { renderMarkdown } from 'comark/render';

export function visibleLength(nodes: Node[]): number {
    return nodes.reduce((sum, n) =>
        sum + (typeof n === 'string' ? n.length : visibleLength(n.slice(2) as Node[])), 0);
}

function truncateNodes(nodes: Node[], budget: { left: number }): Node[] {
    const out: Node[] = [];
    for (const node of nodes) {
        if (budget.left <= 0) break;

        if (typeof node === 'string') {
            if (node.length < budget.left) {
                out.push(node);
                budget.left -= node.length;
            } else {
                out.push(node.slice(0, budget.left - 1).trimEnd() + '…');
                budget.left = 0;
            }
        } else {
            const [tag, props, ...children] = node as ElementNode;
            out.push([tag, props, ...truncateNodes(children as Node[], budget)] as ElementNode);
        }
    }
    return out;
}

export function truncateComark(nodes: Node[], max = 150): Node[] {
    if (visibleLength(nodes) <= max) return nodes;
    return truncateNodes(nodes, { left: max });
}

export async function limitMarkdown(source: string, max = 150): Promise<{ text: string, truncated: boolean }> {
    const doc = await parseMarkdown(source);
    if (visibleLength(doc.nodes) <= max) return { text: source, truncated: false }; // fits, so no round-trip
    return { text: await renderMarkdown({ ...doc, nodes: truncateComark(doc.nodes, max) }), truncated: true };
}

// file bullshit //
export async function urlToFile(url: string, filename: string): Promise<File> {
    const res = await fetch(url)
    const blob = await res.blob()
    return new File([blob], filename, { type: blob.type || 'image/png' })
}