export async function isAdmin() {
    const { loggedIn, user } = await useUserSession();
    return (loggedIn.value && useRuntimeConfig().public.adminIds.includes(user.value!.slackId))
}