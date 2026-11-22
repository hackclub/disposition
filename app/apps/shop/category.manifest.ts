import type { AppDef } from "~/types/window"
import Category from "./category.vue"

export default {
    appId: 'category',
    title: 'View Category',
    component: Category,

    minWidth: 500,
    minHeight: 600,

    tool: true,
    resizeable: true
} satisfies AppDef
