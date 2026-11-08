export default defineEventHandler(async event => {
    const {admin, session} = await isAdmin(event);


})