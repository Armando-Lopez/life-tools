import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const { issueCode } = getQuery(event)
    const response = await axios.get(`https://homecapital.atlassian.net/rest/api/3/issue/${issueCode}`,
      {
        headers: {
          Authorization: event.node.req.headers.authorization
        }
      }
    )
    return response.data?.id
      ? {
          id: response.data.id,
          self: response.data.self,
          code: response.data.key,
          summary: response.data.fields.summary,
          issueTypeIconUrl: response.data.fields.issuetype.iconUrl,
          issueTypeName: response.data.fields.issuetype.name,
          priorityIconUrl: response.data.fields.priority.iconUrl,
          priorityName: response.data.fields.priority.name,
          statusCategoryColor: response.data.fields.status.statusCategory.colorName,
          statusName: response.data.fields.status.name,
          originalEstimate: response.data.fields.timetracking.originalEstimate
        }
      : null
  } catch (e) {
    // @ts-ignore
    throw createError({ statusCode: 400, statusMessage: e.message })
  }
})
