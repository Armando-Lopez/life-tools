import axios from 'axios'
import { normalizeString } from '~/helpers'

export default defineEventHandler(async (event) => {
  try {
    const { issueCode } = await getQuery(event)
    const response = await axios.get(
      `https://homecapital.atlassian.net/rest/api/3/issue/${issueCode}/transitions`,
      {
        headers: {
          Authorization: event.node.req.headers.authorization
        }
      }
    )
    return (response.data?.transitions || []).map((transition: any) => ({
      id: transition.id,
      name: transition.name,
      code: normalizeString(transition.name, ['toUpperCase', 'replaceAll| |_'])
    }))
  } catch (e) {
    // @ts-ignore
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})
