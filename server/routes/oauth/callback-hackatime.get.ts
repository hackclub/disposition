export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    const config = useRuntimeConfig();

});