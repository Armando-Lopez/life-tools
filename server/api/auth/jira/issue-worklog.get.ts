import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const { issue } = getQuery(event)
    const response = await axios.get(`https://homecapital.atlassian.net/rest/api/3/issue/${issue}/worklog`,
      {
        params: {
          startAt: 0,
          maxResults: 10
        },
        headers: {
          Authorization: event.node.req.headers.authorization
        }
      }
    )
    return {
      ...response.data,
      worklogs: response.data.worklogs.filter(
        (worklog: any) => worklog.author.emailAddress === event.context.auth.username
      )
    }
  } catch (e) {
    // @ts-ignore
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})
