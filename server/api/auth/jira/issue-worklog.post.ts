import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const { issue, timeSpentSeconds, started } = await readBody(event)
    const response = await axios.post(
      `https://homecapital.atlassian.net/rest/api/3/issue/${issue}/worklog?notifyUsers=false`,
      { started, timeSpentSeconds },
      {
        headers: {
          Authorization: event.node.req.headers.authorization
        }
      }
    )
    return response.data
  } catch (e) {
    // @ts-ignore
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})
