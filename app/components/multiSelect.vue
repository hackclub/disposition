<script setup lang="ts">
export type MultiSelectOption = {
    value: string,
    label: string,
};

const props = withDefaults(defineProps<{
    options: MultiSelectOption[],
    placeholder?: string,
    emptyText?: string,
    disabled?: boolean,
}>(), {
    placeholder: "Select...",
    emptyText: "Nothing to select",
    disabled: false,
});

const model = defineModel<string[]>({ default: () => [] });

const open = ref(false);
const root = ref<HTMLElement>();

const summary = computed(() => {
    const count = model.value.length;
    if (count === 0) return props.placeholder;
    return `${count} selected`;
});

function isSelected(value: string) {
    return model.value.includes(value);
}

function toggle(value: string) {
    model.value = isSelected(value)
        ? model.value.filter(v => v !== value)
        : [...model.value, value];
}

function remove(value: string) {
    model.value = model.value.filter(v => v !== value);
}

// close when clicking anywhere outside the component
function onPointerDown(event: PointerEvent) {
    if (root.value && !root.value.contains(event.target as Node)) open.value = false;
}

onMounted(() => document.addEventListener("pointerdown", onPointerDown));
onBeforeUnmount(() => document.removeEventListener("pointerdown", onPointerDown));
</script>

<template>
    <div class="multi-select" ref="root" @keydown.esc="open = false">
        <div class="anchor">
            <button type="button" class="trigger" :class="{ open }" :disabled="disabled" @click="open = !open">
                <span class="summary" :class="{ placeholder: model.length === 0 }">{{ summary }}</span>
                <span class="arrow" />
            </button>

            <div class="picker" v-if="open">
                <label class="option" v-for="option in options" :key="option.value"
                    :class="{ checked: isSelected(option.value) }">
                    <input type="checkbox" :checked="isSelected(option.value)" @change="toggle(option.value)" />
                    <span>{{ option.label }}</span>
                </label>

                <p class="empty" v-if="options.length === 0">{{ emptyText }}</p>
            </div>
        </div>

        <div class="chips" v-if="model.length > 0">
            <span class="chip" v-for="value in model" :key="value">
                {{ value }}
                <button type="button" class="remove" :aria-label="`Remove ${value}`" @click="remove(value)">×</button>
            </span>
        </div>
    </div>
</template>

<style scoped>
.multi-select {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.anchor {
    position: relative;
}

.trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    padding: 2px 6px;
    text-align: left;

    &.open .arrow {
        transform: rotate(180deg);
    }
}

.summary {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.placeholder {
        color: var(--color-gray-dark);
    }
}

.arrow {
    flex-shrink: 0;
    width: 9px;
    height: 5px;
    background: var(--color-black);
    clip-path: polygon(0 0, 100% 0, 50% 100%);
}

.picker {
    position: absolute;
    top: calc(100% - 2px);
    left: 0;
    right: 0;
    z-index: 10;

    display: flex;
    flex-direction: column;
    max-height: 200px;
    overflow-y: auto;

    border: 1px solid var(--color-border-light);
    border-radius: 5px;
    background: linear-gradient(180deg, var(--color-bg-light) 0%, var(--color-bg-medium) 41%, var(--color-bg-dark) 56%);
    box-shadow: 0 2px 6px var(--color-shadow-dark);
}

.option {
    padding: 3px 6px;
    font-size: 15px;
    font-weight: normal;
    cursor: pointer;

    &:not(:last-of-type) {
        border-bottom: 1px solid var(--color-border-light);
    }

    &:hover {
        background-color: var(--color-shadow-inset);
    }

    &.checked {
        font-weight: bold;
    }
}

.empty {
    margin: 0;
    padding: 6px;
    color: var(--color-gray-dark);
}

.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.chip {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 4px 2px 6px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-bg-light);
    box-shadow: inset 0 0 0 1px var(--color-white);
}

.remove {
    padding: 0 4px;
    font-size: 13px;
    line-height: 1.2;
    border-radius: 3px;
}
</style>
