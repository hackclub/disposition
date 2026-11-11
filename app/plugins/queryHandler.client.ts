export default defineNuxtPlugin(() => {
    const { open } = useWindowManager();
    const route = useRoute();

    // wait until hydration has fully finished. "app:mounted" fires before async components (like the
    // taskbar, which awaits useFetch) are hydrated, so opening a window there adds a taskbar item the
    // server never rendered -> hydration mismatch
    onNuxtReady(() => {
        const project = Number(route.query.project);
        if (Number.isInteger(project) && project > 0) {
            open("project", { id: project });
        }
    });
});
