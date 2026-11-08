export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const form = await readFormData(event);
    const parsed = ProjectPostBody.safeParse(Object.fromEntries(form));
})