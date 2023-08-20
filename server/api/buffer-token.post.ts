export default defineEventHandler(async (event) => {
  try {
    const { username, password } = await readBody(event)
    return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
  } catch (e) {
    // @ts-ignore
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})
