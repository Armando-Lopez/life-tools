import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const { issueCode, startAt, maxResults, startedAfter, startedBefore } = getQuery(event)
    const response = await axios.get(`https://homecapital.atlassian.net/rest/api/3/issue/${issueCode}/worklog`,
      {
        params: { startAt, maxResults, startedAfter, startedBefore },
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
