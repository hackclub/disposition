export default defineNuxtPlugin((nuxtApp) => {
    const { open } = useWindowManager();
    const route = useRoute();

    nuxtApp.hook("app:mounted", () => {
        const projectId = route.query.projectId;

        if (typeof projectId === "string" && projectId) {
            open("project", { id: Number(projectId) });
        }
    });
});