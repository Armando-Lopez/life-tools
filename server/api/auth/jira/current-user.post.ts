// import { useFetch } from 'nuxt/app'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const { username, password } = await readBody(event)
    const response = await axios.get('https://homecapital.atlassian.net/rest/api/3/myself',
      {
        // @ts-ignore
        auth: { username, password }
      }
    )
    return response.data
  } catch (e) {
    // @ts-ignore
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})
