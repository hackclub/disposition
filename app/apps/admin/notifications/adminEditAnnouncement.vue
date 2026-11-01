<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from "vee-validate";
import { toTypedSchema } from '@vee-validate/zod'
import type { WindowInstance } from '~/types/window';
import type { Notification } from '~/types/notification';
import * as z from "zod";

type Announcement = Notification & { description?: string };

const manager = useWindowManager();
const props = defineProps<{ instance: WindowInstance }>()
const admin = await isAdmin();
if (!admin) manager.close(props.instance.id);

// console.log(props.instance)   <- uncomment to see where your id lives

// CHANGE THIS ONE LINE to wherever the console shows the id you passed in
const announcementId = computed(() => (props.instance as any).params?.id);

const loadFailed = ref(false);
const current = ref<Announcement | null>(null);

if (admin) {
    try {
        const all = await $fetch<Announcement[]>("/api/announcements?readFilter=all");
        current.value = all.find(a => String(a.serverId) === String(announcementId.value)) ?? null;
    } catch {
        loadFailed.value = true;
    }
}

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
    validationSchema: toTypedSchema(z.object({
        title: z.string().trim().min(1, "Title is required"),
        description: z.string().trim().min(1, "Description is required")
    })),
    initialValues: {
        title: current.value?.title ?? "",
        description: current.value?.description ?? ""
    }
});

const [title] = defineField("title");
const [description] = defineField("description");

const canSubmit = computed(() => !!current.value && !!title.value && !!description.value);

const onSubmit = handleSubmit(async (values) => {
    if (!admin || !current.value) return;

    const body = new FormData();
    body.append("title", values.title);
    body.append("description", values.description);

    try {
        await $fetch(`/api/announcements/${current.value.serverId}`, { method: "PATCH", body: body });
        manager.messageBox("Success!", `Announcement ${current.value.serverId} has been updated!`);
        manager.close(props.instance.id);
    } catch (e: any) {
        manager.messageBox("Error!", e.data?.message ?? "Update failed", { error: true });
    }
});
</script>