import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const { issue, started, timeSpentSeconds, workLogId } = await readBody(event)
    const response = await axios.put(
      `https://homecapital.atlassian.net/rest/api/3/issue/${issue}/worklog/${workLogId}?notifyUsers=false`,
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
