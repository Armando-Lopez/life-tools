import { JIRA_ISSUES_URL_API, JIRA_ISSUE_WORK_LOG_URL_API } from '~/constants/api'

export const useJiraIssue = () => {
  const isLoading = ref(false)

  const toggleLoading = () => {
    isLoading.value = !isLoading.value
  }
  async function getJiraIssue (issueCode: string) {
    try {
      toggleLoading()
      const { data } = await useFetch(JIRA_ISSUES_URL_API, {
        server: false,
        // @ts-ignore
        headers: { authorization: useState('jiraAuth').value },
        query: { issueCode }
      })
      return data.value
    } catch (e) {
      console.error(e)
      return { data: null, error: e }
    } finally {
      toggleLoading()
    }
  }
  async function getJiraIssueWorkLogs (query: { issueCode: string, startedAfter: number }) {
    try {
      toggleLoading()
      const { data, error } = await useFetch(JIRA_ISSUE_WORK_LOG_URL_API, {
        server: false,
        // @ts-ignore
        headers: { authorization: useState('jiraAuth').value },
        query
      })
      if (error.value) {
        return { data: null, error: error.value }
      }
      return {
        data: {
          // @ts-ignore
          ...data.value,
          // @ts-ignore
          worklogs: data.value.worklogs.filter(worklog => worklog.author.accountId === useState('jiraUserId').value)
        },
        error: null
      }
    } catch (e) {
      console.error(e)
      return { data: null, error: e }
    } finally {
      toggleLoading()
    }
  }
  async function createJiraIssueWorkLog (values: { issueCode: string, startAt: string, timeSpentSeconds: number }) {
    try {
      toggleLoading()
      const { data, error } = await useFetch(JIRA_ISSUE_WORK_LOG_URL_API, {
        method: 'POST',
        // @ts-ignore
        headers: { authorization: useState('jiraAuth').value },
        body: {
          issue: values.issueCode,
          timeSpentSeconds: values.timeSpentSeconds,
          startAt: values.startAt
        }
      })
      return { data: data.value, error: error.value }
    } catch (e) {
      console.error(e)
      return { data: null, error: e }
    } finally {
      toggleLoading()
    }
  }

  return {
    isLoading,
    getJiraIssue,
    getJiraIssueWorkLogs,
    createJiraIssueWorkLog
  }
}
