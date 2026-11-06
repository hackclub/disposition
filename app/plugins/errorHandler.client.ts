export default defineNuxtPlugin((nuxtApp) => {
    const { showError } = useErrorHandler();

    window.addEventListener("unhandledrejection", (event) => {
        showError(event.reason);
    });

    nuxtApp.hook("vue:error", (error) => {
        showError(error);
    });
});
