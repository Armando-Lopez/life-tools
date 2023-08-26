import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const { issueCode, startedAfter } = getQuery(event)
    const response = await axios.get(`https://homecapital.atlassian.net/rest/api/3/issue/${issueCode}/worklog`,
      {
        params: { startedAfter, author: '62d98de977308a9694e26468' },
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
