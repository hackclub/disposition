import { blob } from 'hub:blob'
import { createError, eventHandler, getRouterParam } from 'h3'

export default eventHandler(async (event) => {
  const pathname = getRouterParam(event, 'pathname')
  if (!pathname) {
    throw createError({ statusCode: 404, message: 'Not Found' })
  }

  return blob.serve(event, pathname)
})