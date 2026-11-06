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

// truncating markdown and shi. god bless claude sonnet 5.5 //

import type { Node, ElementNode } from 'comark';

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

// file bullshit //

export async function urlToFile(url: string, filename: string): Promise<File> {
    const res = await fetch(url)
    const blob = await res.blob()
    return new File([blob], filename, { type: blob.type || 'image/png' })
}