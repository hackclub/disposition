export async function isAdmin() {
    const { loggedIn, user } = await useUserSession();
    return (loggedIn.value && useRuntimeConfig().public.adminIds.includes(user.value!.slackId))
}

// shoutout https://stackoverflow.com/a/76806394
export function getTextWidth(items: string | string[], font: string | HTMLElement, fallbackFont?: string): number {
    const canvas = ((getTextWidth as any).canvas as HTMLCanvasElement ||
        ((getTextWidth as any).canvas = document.createElement('canvas') as HTMLCanvasElement));
    const context = canvas.getContext('2d')!;
    let maxWidth = 0;
    let elementFont;

    if (typeof font === 'string')
        elementFont = font;
    // else if (typeof font === 'object')
    //     elementFont = getFont(font);

    if (elementFont)
        context.font = elementFont;
    else if (fallbackFont)
        context.font = fallbackFont;
    else
        context.font = 'normal 12px sans-serif';

    if (!Array.isArray(items))
        items = [items];

    for (const item of items) {
        const width = context.measureText(item).width;
        maxWidth = Math.max(maxWidth, width);
    }

    return maxWidth;
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